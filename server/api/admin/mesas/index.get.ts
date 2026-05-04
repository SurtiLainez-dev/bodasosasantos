import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const [rows]: any = await db.query(`
    SELECT 
      m.*,
      COUNT(s.id) AS sillas_ocupadas
    FROM mesas m
    LEFT JOIN sillas s ON s.mesa_id = m.id
    GROUP BY m.id
    ORDER BY m.numero ASC
  `)

    return {
        ok: true,
        mesas: rows
    }
})
