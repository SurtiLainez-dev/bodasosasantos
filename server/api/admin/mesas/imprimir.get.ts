import PDFDocument from 'pdfkit'
import type { RowDataPacket } from 'mysql2'
import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

type MesaPdfRow = RowDataPacket & {
    mesa_id: number
    mesa_nombre: string | null
    mesa_numero: number
    mesa_capacidad: number

    silla_id: number | null
    silla_nombre: string | null

    invitacion_id: number | null
    invitacion_nombre: string | null
    cod_reserva: string | null
}

type PersonaPdf = {
    id: number
    nombre: string
}

type InvitacionPdf = {
    id: number
    nombre: string
    cod_reserva: string
    personas: PersonaPdf[]
}

type MesaPdf = {
    id: number
    nombre: string
    numero: number
    capacidad: number
    ocupadas: number
    invitaciones: InvitacionPdf[]
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    try {
        const [rows] = await db.query<MesaPdfRow[]>(`
      SELECT
        m.id AS mesa_id,
        m.nombre AS mesa_nombre,
        m.numero AS mesa_numero,
        m.capacidad AS mesa_capacidad,

        s.id AS silla_id,
        s.nombre AS silla_nombre,

        i.id AS invitacion_id,
        i.nombre AS invitacion_nombre,
        i.cod_reserva

      FROM mesas AS m

      LEFT JOIN sillas AS s
        ON s.mesa_id = m.id

      LEFT JOIN invitaciones AS i
        ON i.id = s.invitacion_id

      ORDER BY
        m.numero ASC,
        i.nombre ASC,
        s.id ASC
    `)

        const mesasMap = new Map<number, MesaPdf>()

        for (const row of rows) {
            if (!mesasMap.has(row.mesa_id)) {
                mesasMap.set(row.mesa_id, {
                    id: row.mesa_id,
                    nombre:
                        row.mesa_nombre?.trim() ||
                        `Mesa ${row.mesa_numero}`,
                    numero: row.mesa_numero,
                    capacidad: row.mesa_capacidad,
                    ocupadas: 0,
                    invitaciones: []
                })
            }

            const mesa = mesasMap.get(row.mesa_id)!

            if (
                !row.silla_id ||
                !row.invitacion_id
            ) {
                continue
            }

            let invitacion = mesa.invitaciones.find(
                (item) => item.id === row.invitacion_id
            )

            if (!invitacion) {
                invitacion = {
                    id: row.invitacion_id,
                    nombre:
                        row.invitacion_nombre?.trim() ||
                        'Invitación sin nombre',
                    cod_reserva:
                        row.cod_reserva?.trim() || '',
                    personas: []
                }

                mesa.invitaciones.push(invitacion)
            }

            const numeroPersona =
                invitacion.personas.length + 1

            invitacion.personas.push({
                id: row.silla_id,
                nombre:
                    row.silla_nombre?.trim() ||
                    (
                        numeroPersona === 1
                            ? row.invitacion_nombre?.trim() ||
                            'Nombre pendiente'
                            : `Acompañante ${numeroPersona}`
                    )
            })

            mesa.ocupadas++
        }

        const mesas = Array.from(mesasMap.values())

        const pdfBuffer = await generarPdfMesas(mesas)

        const fecha = new Date()
            .toISOString()
            .slice(0, 10)

        setResponseHeader(
            event,
            'Content-Type',
            'application/pdf'
        )

        setResponseHeader(
            event,
            'Content-Disposition',
            `attachment; filename="mesas-invitados-${fecha}.pdf"`
        )

        setResponseHeader(
            event,
            'Content-Length',
            pdfBuffer.length.toString()
        )

        setResponseHeader(
            event,
            'Cache-Control',
            'no-store'
        )

        return pdfBuffer
    } catch (error: any) {
        console.error(
            'Error generando PDF de mesas:',
            error
        )

        throw createError({
            statusCode: 500,
            statusMessage:
                'No se pudo generar el PDF de las mesas.'
        })
    }
})

const generarPdfMesas = (
    mesas: MesaPdf[]
): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const document = new PDFDocument({
            size: 'LETTER',
            margins: {
                top: 45,
                right: 45,
                bottom: 55,
                left: 45
            },
            bufferPages: true,
            info: {
                Title: 'Listado de mesas e invitados',
                Author: 'Andrea & Williams',
                Subject: 'Distribución de invitados por mesa'
            }
        })

        const chunks: Buffer[] = []

        document.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
        })

        document.on('end', () => {
            resolve(Buffer.concat(chunks))
        })

        document.on('error', reject)

        agregarEncabezado(document)

        if (!mesas.length) {
            document
                .moveDown(3)
                .font('Helvetica')
                .fontSize(13)
                .fillColor('#666666')
                .text(
                    'No hay mesas registradas actualmente.',
                    {
                        align: 'center'
                    }
                )

            document.end()
            return
        }

        mesas.forEach((mesa, mesaIndex) => {
            verificarEspacio(document, 130)

            agregarMesa(document, mesa)

            if (mesaIndex < mesas.length - 1) {
                document.moveDown(1.2)
            }
        })

        agregarNumeracionPaginas(document)

        document.end()
    })
}

const agregarEncabezado = (
    document: PDFKit.PDFDocument
) => {
    document
        .font('Helvetica-Bold')
        .fontSize(22)
        .fillColor('#2F2923')
        .text('Andrea & Williams', {
            align: 'center'
        })

    document
        .moveDown(0.25)
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#806442')
        .text('LISTADO DE MESAS E INVITADOS', {
            align: 'center',
            characterSpacing: 1.3
        })

    document
        .moveDown(0.4)
        .fontSize(9)
        .fillColor('#777777')
        .text(
            `Generado el ${formatearFecha(new Date())}`,
            {
                align: 'center'
            }
        )

    document
        .moveDown(1.2)
        .strokeColor('#C7A67D')
        .lineWidth(1)
        .moveTo(
            document.page.margins.left,
            document.y
        )
        .lineTo(
            document.page.width -
            document.page.margins.right,
            document.y
        )
        .stroke()

    document.moveDown(1.5)
}

const agregarMesa = (
    document: PDFKit.PDFDocument,
    mesa: MesaPdf
) => {
    const inicioX = document.page.margins.left
    const anchoDisponible =
        document.page.width -
        document.page.margins.left -
        document.page.margins.right

    const tituloY = document.y

    document
        .roundedRect(
            inicioX,
            tituloY,
            anchoDisponible,
            54,
            8
        )
        .fill('#F4EEE7')

    document
        .font('Helvetica-Bold')
        .fontSize(15)
        .fillColor('#332C26')
        .text(
            `${mesa.nombre}`,
            inicioX + 14,
            tituloY + 10,
            {
                width: anchoDisponible - 150
            }
        )

    document
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#766A60')
        .text(
            `Mesa número ${mesa.numero}`,
            inicioX + 14,
            tituloY + 31
        )

    document
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#806442')
        .text(
            `${mesa.ocupadas}/${mesa.capacidad} lugares`,
            inicioX + anchoDisponible - 125,
            tituloY + 20,
            {
                width: 110,
                align: 'right'
            }
        )

    document.y = tituloY + 68

    if (!mesa.invitaciones.length) {
        document
            .font('Helvetica-Oblique')
            .fontSize(10)
            .fillColor('#888888')
            .text('Esta mesa no tiene invitados asignados.', {
                indent: 12
            })

        return
    }

    mesa.invitaciones.forEach(
        (invitacion, invitacionIndex) => {
            verificarEspacio(
                document,
                65 + invitacion.personas.length * 20
            )

            const invitacionY = document.y

            document
                .font('Helvetica-Bold')
                .fontSize(11)
                .fillColor('#333333')
                .text(
                    `${invitacionIndex + 1}. ${invitacion.nombre}`,
                    inicioX + 10,
                    invitacionY,
                    {
                        width: anchoDisponible - 20
                    }
                )

            if (invitacion.cod_reserva) {
                document
                    .moveDown(0.15)
                    .font('Helvetica')
                    .fontSize(8)
                    .fillColor('#888888')
                    .text(
                        `Código de reserva: ${invitacion.cod_reserva}`,
                        {
                            indent: 22
                        }
                    )
            }

            document.moveDown(0.35)

            invitacion.personas.forEach(
                (persona, personaIndex) => {
                    verificarEspacio(document, 24)

                    document
                        .font('Helvetica')
                        .fontSize(10)
                        .fillColor('#4C4641')
                        .text(
                            `${personaIndex + 1}. ${persona.nombre}`,
                            {
                                indent: 30,
                                lineGap: 3
                            }
                        )
                }
            )

            document
                .moveDown(0.45)
                .strokeColor('#E6DDD4')
                .lineWidth(0.6)
                .moveTo(inicioX + 10, document.y)
                .lineTo(
                    inicioX + anchoDisponible - 10,
                    document.y
                )
                .stroke()

            document.moveDown(0.7)
        }
    )
}

const verificarEspacio = (
    document: PDFKit.PDFDocument,
    espacioNecesario: number
) => {
    const limiteInferior =
        document.page.height -
        document.page.margins.bottom -
        25

    if (
        document.y + espacioNecesario >
        limiteInferior
    ) {
        document.addPage()

        document
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#806442')
            .text(
                'Andrea & Williams · Mesas e invitados',
                {
                    align: 'right'
                }
            )

        document.moveDown(1)
    }
}

const agregarNumeracionPaginas = (
    document: PDFKit.PDFDocument
) => {
    const rango = document.bufferedPageRange()

    for (
        let pagina = 0;
        pagina < rango.count;
        pagina++
    ) {
        document.switchToPage(pagina)

        const texto =
            `Página ${pagina + 1} de ${rango.count}`

        document
            .font('Helvetica')
            .fontSize(8)
            .fillColor('#888888')
            .text(
                texto,
                document.page.margins.left,
                document.page.height - 35,
                {
                    width:
                        document.page.width -
                        document.page.margins.left -
                        document.page.margins.right,
                    align: 'center',
                    lineBreak: false
                }
            )
    }
}

const formatearFecha = (
    fecha: Date
): string => {
    return new Intl.DateTimeFormat('es-HN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(fecha)
}
