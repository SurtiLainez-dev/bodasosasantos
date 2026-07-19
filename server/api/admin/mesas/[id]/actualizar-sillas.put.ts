import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'
type SillaPayload = {
    id: number
    nombre: string
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const mesaId = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    const sillas = Array.isArray(body?.sillas)
        ? body.sillas as SillaPayload[]
        : []

    if (!mesaId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Mesa inválida.'
        })
    }

    if (sillas.length === 0) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'No se recibieron sillas para actualizar.'
        })
    }

    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        for (const silla of sillas) {
            const sillaId = Number(silla?.id)
            const nombre = String(silla?.nombre || '').trim()

            if (!sillaId) {
                throw createError({
                    statusCode: 422,
                    statusMessage:
                        'Una de las sillas recibidas es inválida.'
                })
            }

            if (nombre.length > 150) {
                throw createError({
                    statusCode: 422,
                    statusMessage:
                        'El nombre no puede superar los 150 caracteres.'
                })
            }

            const [resultado]: any =
                await connection.execute(
                    `
            UPDATE sillas
            SET nombre = ?
            WHERE id = ?
              AND mesa_id = ?
          `,
                    [
                        nombre || null,
                        sillaId,
                        mesaId
                    ]
                )

            if (Number(resultado.affectedRows || 0) === 0) {
                throw createError({
                    statusCode: 404,
                    statusMessage:
                        `La silla ${sillaId} no pertenece a esta mesa.`
                })
            }
        }

        await connection.commit()

        return {
            success: true,
            message:
                'Los nombres fueron actualizados correctamente.'
        }
    } catch (error: any) {
        await connection.rollback()

        console.error('ERROR AL ACTUALIZAR SILLAS:', error)

        if (error?.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage:
                'No se pudieron actualizar los nombres.'
        })
    } finally {
        connection.release()
    }
})
