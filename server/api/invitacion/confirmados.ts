import { db } from '~/server/utils/db'

export default defineEventHandler(async () => {

    const [rows]: any = await db.query(`
    SELECT
      nombre,
      cantidad_confirmados
    FROM invitaciones
    WHERE respuesta_recibida = 1
      AND respuesta = 'SI'
    ORDER BY nombre ASC
  `)

    return {
        ok: true,
        invitados: rows
    }
})
