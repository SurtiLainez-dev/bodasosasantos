import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'
type MesaRow = {
    id: number
    nombre: string | null
    numero: number
    capacidad: number
    sillas_ocupadas: number
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    try {
        const [rows] = await db.query<MesaRow[]>(`
      SELECT
        m.id,
        m.nombre,
        m.numero,
        m.capacidad,
        COUNT(s.id) AS sillas_ocupadas
      FROM mesas m
      LEFT JOIN sillas s
        ON s.mesa_id = m.id
      GROUP BY
        m.id,
        m.nombre,
        m.numero,
        m.capacidad
      ORDER BY
        m.numero ASC,
        m.id ASC
    `)

        const mesas = rows.map((mesa) => {
            const capacidad = Number(mesa.capacidad || 0)
            const ocupadas = Number(mesa.sillas_ocupadas || 0)
            const disponibles = Math.max(capacidad - ocupadas, 0)

            return {
                id: Number(mesa.id),
                nombre: mesa.nombre,
                numero: Number(mesa.numero),
                capacidad,
                sillas_ocupadas: ocupadas,
                sillas_disponibles: disponibles,
                porcentaje_ocupacion:
                    capacidad > 0
                        ? Math.min(Math.round((ocupadas / capacidad) * 100), 100)
                        : 0
            }
        })

        return {
            success: true,
            mesas
        }
    } catch (error: any) {
        console.error('ERROR AL CARGAR MESAS:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'No se pudieron cargar las mesas.'
        })
    }
})
