import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'
import type { RowDataPacket } from 'mysql2'

type MesaRow = RowDataPacket & {
    id: number
    nombre: string | null
    numero: number
    capacidad: number
}

type SillaRow = RowDataPacket & {
    silla_id: number
    silla_nombre: string | null
    invitacion_id: number
    invitacion_nombre: string
    cod_reserva: string | null
    cantidad_confirmados: number | null
}

type SillaDetalle = {
    id: number
    nombre: string
}

type InvitacionDetalle = {
    id: number
    nombre: string
    cod_reserva: string
    cantidad_confirmados: number
    cantidad_sillas: number
    sillas: SillaDetalle[]
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const mesaId = Number(getRouterParam(event, 'id'))

    if (!Number.isInteger(mesaId) || mesaId < 1) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Mesa inválida.'
        })
    }

    try {
        const [mesas] = await db.execute<MesaRow[]>(
            `
                SELECT
                    id,
                    nombre,
                    numero,
                    capacidad
                FROM mesas
                WHERE id = ?
                LIMIT 1
            `,
            [mesaId]
        )

        const mesa = mesas[0]

        if (!mesa) {
            throw createError({
                statusCode: 404,
                statusMessage: 'La mesa no fue encontrada.'
            })
        }

        const [sillas] = await db.execute<SillaRow[]>(
            `
                SELECT
                    *
                FROM sillas AS s
                INNER JOIN invitaciones AS i
                    ON i.id = s.invitacion_id
                WHERE s.mesa_id = ?
                ORDER BY
                    i.nombre ASC,
                    s.id ASC
            `,
            [mesaId]
        )

        const invitacionesMap =
            new Map<number, InvitacionDetalle>()

        for (const silla of sillas) {
            const invitacionId = Number(
                silla.invitacion_id
            )

            if (!invitacionesMap.has(invitacionId)) {
                invitacionesMap.set(invitacionId, {
                    id: invitacionId,
                    nombre:
                        silla.invitacion_nombre ||
                        'Invitación sin nombre',
                    cod_reserva:
                        silla.cod_reserva || '',
                    cantidad_confirmados: Number(
                        silla.cantidad_confirmados || 0
                    ),
                    cantidad_sillas: 0,
                    sillas: []
                })
            }

            const invitacion =
                invitacionesMap.get(invitacionId)

            if (!invitacion) {
                continue
            }

            invitacion.cantidad_sillas += 1

            invitacion.sillas.push({
                id: Number(silla.silla_id),
                nombre: silla.silla_nombre || ''
            })
        }

        const invitaciones = Array.from(
            invitacionesMap.values()
        )

        const capacidad = Number(mesa.capacidad || 0)
        const sillasOcupadas = sillas.length

        return {
            success: true,

            mesa: {
                id: Number(mesa.id),

                nombre:
                    mesa.nombre ||
                    `Mesa ${Number(mesa.numero)}`,

                numero: Number(mesa.numero),

                capacidad,

                sillas_ocupadas: sillasOcupadas,

                sillas_disponibles: Math.max(
                    capacidad - sillasOcupadas,
                    0
                ),

                porcentaje_ocupacion:
                    capacidad > 0
                        ? Math.min(
                            Math.round(
                                (
                                    sillasOcupadas /
                                    capacidad
                                ) * 100
                            ),
                            100
                        )
                        : 0,

                invitaciones
            }
        }
    } catch (error: any) {
        console.error(
            'ERROR AL CARGAR DETALLE DE MESA:',
            {
                message: error?.message,
                code: error?.code,
                errno: error?.errno,
                sqlMessage: error?.sqlMessage,
                sql: error?.sql,
                stack: error?.stack
            }
        )

        if (error?.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage:
                error?.sqlMessage ||
                error?.message ||
                'No se pudo cargar la mesa.'
        })
    }
})
