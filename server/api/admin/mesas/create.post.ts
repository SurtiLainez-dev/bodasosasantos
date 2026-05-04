import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const body = await readBody(event)

    await db.query(`
    INSERT INTO mesas (nombre, numero, capacidad)
    VALUES (?, ?, ?)
  `, [
        body.nombre,
        body.numero,
        body.capacidad
    ])

    return { ok: true }
})
