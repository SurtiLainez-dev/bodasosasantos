import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const token = String(body.token || '').trim()
    const cod_reserva = String(body.cod_reserva || '').trim()

    if (!token || !cod_reserva) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Token y código de reserva son requeridos.'
        })
    }

    if (!/^\d{9}$/.test(cod_reserva)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'El código de reserva debe tener 9 dígitos.'
        })
    }

    const [rows]: any = await db.query(`
    SELECT
      id,
      nombre,
      foto,
      cantidad_permitida,
      cod_reserva,
      token_acceso,
      respuesta_recibida,
      respuesta,
      telefono
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

    if (invitacion.respuesta_recibida || invitacion.respuesta) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Esta invitación ya fue respondida. Si necesitas ayuda, puedes escribirnos por WhatsApp.'
        })
    }

    return {
        ok: true,
        invitado: {
            id: invitacion.id,
            nombre: invitacion.nombre,
            foto: invitacion.foto,
            cantidad_permitida: Number(invitacion.cantidad_permitida || 1),
            cod_reserva: invitacion.cod_reserva,
            iniciales: String(invitacion.nombre || '')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((p: string) => p[0])
                .join('')
                .toUpperCase()
        }
    }
})
