import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const token = String(body.token || '').trim()

    const ip =
        getRequestHeader(event, 'x-forwarded-for') ||
        event.node.req.socket.remoteAddress ||
        ''

    const userAgent = getRequestHeader(event, 'user-agent') || ''

    let invitacionId = null
    let tieneToken = token ? 1 : 0
    let tokenValido = 0

    if (token) {
        const [rows]: any = await db.query(`
      SELECT id
      FROM invitaciones
      WHERE token_acceso = ?
      LIMIT 1
    `, [token])

        if (rows.length) {
            invitacionId = rows[0].id
            tokenValido = 1
        }
    }

    await db.query(`
    INSERT INTO visitas_invitacion (
      invitacion_id,
      token_acceso,
      tiene_token,
      token_valido,
      ip,
      user_agent,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `, [
        invitacionId,
        token || null,
        tieneToken,
        tokenValido,
        ip,
        userAgent
    ])

    return {
        ok: true,
        visita: {
            invitacion_id: invitacionId,
            tiene_token: tieneToken,
            token_valido: tokenValido
        }
    }
})
