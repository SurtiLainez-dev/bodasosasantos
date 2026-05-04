import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const token = String(query.token || '').trim()

    const ip =
        getHeader(event, 'x-forwarded-for') ||
        getHeader(event, 'x-real-ip') ||
        ''

    const userAgent = getHeader(event, 'user-agent') || ''

    if (!token) {
        await db.query(`
      INSERT INTO visitas_invitacion (
        tiene_token,
        token_valido,
        ip,
        user_agent
      )
      VALUES (0, 0, ?, ?)
    `, [ip, userAgent])

        return {
            ok: false,
            hasToken: false,
            message: 'Sin token'
        }
    }

    const [rows]: any = await db.query(`
    SELECT 
      id,
      nombre,
      cantidad_permitida,
      cod_reserva,
      token_acceso,
      respuesta_recibida,
      respuesta,
      caducada
    FROM invitaciones
    WHERE token_acceso = ?
    LIMIT 1
  `, [token])

    if (!rows.length) {
        await db.query(`
      INSERT INTO visitas_invitacion (
        token_acceso,
        tiene_token,
        token_valido,
        ip,
        user_agent
      )
      VALUES (?, 1, 0, ?, ?)
    `, [token, ip, userAgent])

        return {
            ok: false,
            hasToken: true,
            validToken: false,
            message: 'Token inválido'
        }
    }

    const invitacion = rows[0]

    await db.query(`
    INSERT INTO visitas_invitacion (
      invitacion_id,
      token_acceso,
      tiene_token,
      token_valido,
      ip,
      user_agent
    )
    VALUES (?, ?, 1, 1, ?, ?)
  `, [
        invitacion.id,
        token,
        ip,
        userAgent
    ])

    return {
        ok: true,
        hasToken: true,
        validToken: true,
        invitacion
    }
})
