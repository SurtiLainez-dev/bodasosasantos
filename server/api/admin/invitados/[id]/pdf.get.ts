import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import fs from 'node:fs'
import path from 'node:path'
import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const id = getRouterParam(event, 'id')

    const [rows]: any = await db.query(`
    SELECT id, nombre, token_acceso
    FROM invitaciones
    WHERE id = ?
    LIMIT 1
  `, [id])

    if (!rows.length) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Invitación no encontrada'
        })
    }

    const invitacion = rows[0]
    const url = `http://localhost:3000/?token=${invitacion.token_acceso}`

    const qrDataUrl = await QRCode.toDataURL(url, {
        width: 900,
        margin: 1
    })

    const qrBuffer = Buffer.from(
        qrDataUrl.replace(/^data:image\/png;base64,/, ''),
        'base64'
    )

    const doc = new PDFDocument({
        size: [1080, 1080],
        margin: 0
    })

    const fontPath = path.resolve('server/assets/fonts/Parisienne-Regular.ttf')

    if (fs.existsSync(fontPath)) {
        doc.registerFont('Parisienne', fontPath)
    }

    const scriptFont = fs.existsSync(fontPath) ? 'Parisienne' : 'Helvetica-Oblique'

    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))

    const pdfBuffer: Buffer = await new Promise((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)))

        // Fondo
        doc.rect(0, 0, 1080, 1080).fill('#fff8f1')

        // Tarjeta blanca
        doc
            .roundedRect(100, 70, 880, 940, 38)
            .fill('#ffffff')

        doc
            .roundedRect(100, 70, 880, 940, 38)
            .lineWidth(1.5)
            .strokeColor('#d7b98a')
            .stroke()

        // Andrea & Williams cursivo
        doc
            .fillColor('#8a643d')
            .font(scriptFont)
            .fontSize(64)
            .text('Andrea & Williams', 140, 170, {
                width: 800,
                align: 'center'
            })

        // Invitacion especial elegante
        doc
            .fillColor('#2f2923')
            .font(scriptFont)
            .fontSize(86)
            .text('Invitación especial', 140, 270, {
                width: 800,
                align: 'center'
            })

        // Para + nombre
        doc
            .fillColor('#2f2923')
            .font('Times-Roman')
            .fontSize(30)
            .text('Para:', 140, 405, {
                width: 800,
                align: 'center',
                continued: true
            })
            .font('Times-Bold')
            .text(` ${invitacion.nombre.toUpperCase()}`, {
                align: 'center'
            })

        // Mensaje
        doc
            .fillColor('#2f2923')
            .font('Times-Roman')
            .fontSize(28)
            .text(
                'Escanea este código QR para ver tu invitación digital.',
                160,
                475,
                {
                    width: 760,
                    align: 'center'
                }
            )

        // QR
        doc.image(qrBuffer, 370, 565, {
            width: 340
        })

        // Botón
        doc
            .roundedRect(300, 925, 480, 66, 33)
            .fill('#8a643d')

        doc
            .fillColor('#ffffff')
            .font('Times-Bold')
            .fontSize(24)
            .text('Presiona aquí para ver la invitación', 300, 945, {
                width: 480,
                align: 'center',
                link: url,
                underline: false
            })

        doc.end()
    })

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(
        event,
        'Content-Disposition',
        `attachment; filename="Invitacion-${invitacion.nombre}.pdf"`
    )

    return pdfBuffer
})
