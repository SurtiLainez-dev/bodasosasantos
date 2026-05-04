import crypto from 'node:crypto'
import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

const generarCodigo = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString()
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const body = await readBody(event)

    const codReserva = generarCodigo()
    const tokenAcceso = crypto.randomBytes(32).toString('hex')

    await db.query(`
    INSERT INTO invitaciones (
      tipo,
      nombre,
      cantidad_permitida,
      foto,
      cod_reserva,
      token_acceso,
      fecha_vencimiento,
      comentario
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
        body.tipo,
        body.nombre,
        body.cantidad_permitida || 1,
        body.foto || null,
        codReserva,
        tokenAcceso,
        body.fecha_vencimiento || '2025-06-01',
        body.comentario || null
    ])

    return {
        ok: true,
        cod_reserva: codReserva,
        token_acceso: tokenAcceso
    }
})
