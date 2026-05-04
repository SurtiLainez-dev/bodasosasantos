import QRCode from 'qrcode'
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

    const url = `https://bodasosasantos.online/?token=${invitacion.token_acceso}`

    const qr = await QRCode.toDataURL(url, {
        width: 900,
        margin: 2
    })

    return {
        ok: true,
        nombre: invitacion.nombre,
        url,
        qr
    }
})
