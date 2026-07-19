import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'
import type { RowDataPacket } from 'mysql2'

type InvitacionDisponible = RowDataPacket & {
    id: number
    tipo: 'novio' | 'novia'
    nombre: string
    cod_reserva: string | null
    telefono: string | null
    cantidad_confirmados: number
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    try {
        const [rows] = await db.query<InvitacionDisponible[]>(`
            SELECT
                i.id,
                i.tipo,
                i.nombre,
                i.cod_reserva,
                i.telefono,
                i.cantidad_confirmados
            FROM invitaciones i
            LEFT JOIN sillas s
                ON s.invitacion_id = i.id
            WHERE
                i.respuesta_recibida = 1
                AND i.respuesta = 'SI'
                AND COALESCE(i.cantidad_confirmados, 0) > 0
                AND s.id IS NULL
            ORDER BY
                i.tipo ASC,
                i.nombre ASC
        `)

        return {
            success: true,
            invitaciones: rows.map((item) => ({
                id: Number(item.id),
                tipo: item.tipo,
                nombre: item.nombre,
                cod_reserva: item.cod_reserva,
                telefono: item.telefono,
                cantidad_confirmados: Number(item.cantidad_confirmados)
            }))
        }
    } catch (error: any) {
        console.error(
            'ERROR AL CARGAR INVITACIONES DISPONIBLES',
            error
        )

        throw createError({
            statusCode: 500,
            statusMessage:
                error?.sqlMessage ??
                error?.message ??
                'No se pudieron cargar las invitaciones.'
        })
    }
})
