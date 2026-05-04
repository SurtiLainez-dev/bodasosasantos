import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const [[stats]]: any = await db.query(`
    SELECT
      COUNT(*) AS total_visitas,
      SUM(CASE WHEN tiene_token = 1 THEN 1 ELSE 0 END) AS visitas_con_token,
      SUM(CASE WHEN tiene_token = 0 THEN 1 ELSE 0 END) AS visitas_sin_token,
      SUM(CASE WHEN token_valido = 1 THEN 1 ELSE 0 END) AS visitas_token_valido,
      SUM(CASE WHEN token_valido = 0 AND tiene_token = 1 THEN 1 ELSE 0 END) AS visitas_token_invalido
    FROM visitas_invitacion
  `)

    return {
        ok: true,
        stats
    }
})
