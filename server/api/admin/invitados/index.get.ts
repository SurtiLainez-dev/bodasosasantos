import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const [rows]: any = await db.query(`
    SELECT *
    FROM invitaciones
    ORDER BY created_at DESC
  `)

    return {
        ok: true,
        invitados: rows
    }
})
