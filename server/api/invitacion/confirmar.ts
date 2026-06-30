import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const token = String(body.token || '').trim()
    const cod_reserva = String(body.cod_reserva || '').trim()
    const respuesta = String(body.respuesta || '').trim()
    const telefono = String(body.telefono || '').trim()
    const cantidad_asistira = Number(body.cantidad_asistira || 0)

    const ip =
        getRequestHeader(event, 'x-forwarded-for') ||
        event.node.req.socket.remoteAddress ||
        ''

    const userAgent = getRequestHeader(event, 'user-agent') || ''

    if (!token || !cod_reserva) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Token y código de reserva son requeridos.'
        })
    }

    if (!['SI', 'NO'].includes(respuesta)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Respuesta inválida.'
        })
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
      caducada,
      fecha_vencimiento
    FROM invitaciones
    WHERE token_acceso = ?
    LIMIT 1
  `, [token])

    if (!rows.length) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Esta invitación no existe o el enlace no es válido.'
        })
    }

    const invitacion = rows[0]

    if (invitacion.cod_reserva !== cod_reserva) {
        throw createError({
            statusCode: 422,
            statusMessage: `El código de reserva no coincide con la invitación de ${invitacion.nombre}.`
        })
    }

    if (invitacion.caducada) {
        throw createError({
            statusCode: 410,
            statusMessage: 'Esta invitación ya no está disponible.'
        })
    }

    if (invitacion.fecha_vencimiento) {
        const now = new Date()
        const vencimiento = new Date(invitacion.fecha_vencimiento)

        if (now >= vencimiento) {
            throw createError({
                statusCode: 410,
                statusMessage: 'El tiempo para confirmar asistencia ya finalizó.'
            })
        }
    }

    if (invitacion.respuesta_recibida || invitacion.respuesta) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Esta invitación ya fue respondida. Si necesitas ayuda, puedes escribirnos por WhatsApp.'
        })
    }

    if (respuesta === 'SI') {
        if (!telefono) {
            throw createError({
                statusCode: 400,
                statusMessage: 'El número de teléfono es requerido.'
            })
        }

        if (!cantidad_asistira || cantidad_asistira <= 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'La cantidad de asistentes debe ser mayor a 0.'
            })
        }

        if (cantidad_asistira > Number(invitacion.cantidad_permitida)) {
            throw createError({
                statusCode: 422,
                statusMessage: `Tu invitación permite máximo ${invitacion.cantidad_permitida} ${
                    Number(invitacion.cantidad_permitida) === 1 ? 'persona' : 'personas'
                }.`
            })
        }
    }

    await db.query(`
    UPDATE invitaciones
    SET
      respuesta_recibida = 1,
      respuesta = ?,
      telefono = ?,
      cantidad_confirmados = ?,
      fecha_respuesta = NOW(),
      ip_respuesta = ?,
      user_agent = ?,
      updated_at = NOW()
    WHERE id = ?
  `, [
        respuesta,
        respuesta === 'SI' ? telefono : null,
        respuesta === 'SI' ? cantidad_asistira : 0,
        ip,
        userAgent,
        invitacion.id
    ])

    return {
        ok: true,
        message: 'Respuesta registrada correctamente.'
    }
})
