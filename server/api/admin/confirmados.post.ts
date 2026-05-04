import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const [rows]: any = await db.query(`
    SELECT
      id,
      nombre,
      COALESCE(cantidad_confirmados, 0) AS cantidad_confirmados,
      telefono,
      fecha_respuesta,
      cod_reserva
    FROM invitaciones
    WHERE respuesta_recibida = 1
      AND respuesta = 'SI'
    ORDER BY fecha_respuesta DESC, nombre ASC
  `)

    return {
        ok: true,
        invitados: rows
    }
})
