import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const [[stats]]: any = await db.query(`
    SELECT
      COUNT(*) AS total_invitaciones,
      COALESCE(SUM(cantidad_permitida), 0) AS total_invitados,
      SUM(CASE WHEN respuesta_recibida = 1 AND respuesta = 'SI' THEN 1 ELSE 0 END) AS invitaciones_confirmadas,
      COALESCE(SUM(CASE WHEN respuesta_recibida = 1 AND respuesta = 'SI' THEN cantidad_confirmados ELSE 0 END), 0) AS invitados_confirmados,
      SUM(CASE WHEN respuesta_recibida = 0 THEN 1 ELSE 0 END) AS sin_respuesta,
      SUM(CASE WHEN respuesta_recibida = 1 AND respuesta = 'NO' THEN 1 ELSE 0 END) AS no_asisten,
      SUM(CASE WHEN caducada = 1 THEN 1 ELSE 0 END) AS caducadas
    FROM invitaciones
  `)

    const [[mesas]]: any = await db.query(`
    SELECT 
      COUNT(*) AS total_mesas,
      COALESCE(SUM(capacidad), 0) AS total_sillas
    FROM mesas
  `)

    const [[acomodados]]: any = await db.query(`
    SELECT COUNT(*) AS invitados_acomodados
    FROM sillas
    WHERE invitacion_id IS NOT NULL
  `)

    const [[visitas]]: any = await db.query(`
    SELECT COUNT(*) AS total_visitas
    FROM visitas_invitacion
  `)

    return {
        ok: true,
        stats: {
            ...stats,
            ...mesas,
            ...acomodados,
            ...visitas
        }
    }
})
