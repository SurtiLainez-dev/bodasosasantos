import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const mesaId = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    const nombre = String(body?.nombre || '').trim()
    const numero = Number(body?.numero || 0)
    const capacidad = Number(body?.capacidad || 0)

    if (!mesaId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Mesa inválida.'
        })
    }

    if (!numero || numero < 1) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'El número debe ser mayor que cero.'
        })
    }

    if (!capacidad || capacidad < 1) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'La capacidad debe ser mayor que cero.'
        })
    }

    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        const [mesas]: any = await connection.execute(
            `
        SELECT id
        FROM mesas
        WHERE id = ?
        LIMIT 1
        FOR UPDATE
      `,
            [mesaId]
        )

        if (!mesas[0]) {
            throw createError({
                statusCode: 404,
                statusMessage: 'La mesa no fue encontrada.'
            })
        }

        const [ocupacion]: any =
            await connection.execute(
                `
          SELECT COUNT(*) AS total
          FROM sillas
          WHERE mesa_id = ?
        `,
                [mesaId]
            )

        const sillasOcupadas = Number(
            ocupacion[0]?.total || 0
        )

        if (capacidad < sillasOcupadas) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    `La mesa tiene ${sillasOcupadas} lugares ocupados. ` +
                    `La capacidad no puede reducirse a ${capacidad}.`
            })
        }

        await connection.execute(
            `
        UPDATE mesas
        SET
          nombre = ?,
          numero = ?,
          capacidad = ?
        WHERE id = ?
      `,
            [
                nombre || `MESA ${numero}`,
                numero,
                capacidad,
                mesaId
            ]
        )

        await connection.commit()

        return {
            success: true,
            message: 'Mesa actualizada correctamente.'
        }
    } catch (error: any) {
        await connection.rollback()

        console.error('ERROR AL ACTUALIZAR MESA:', error)

        if (error?.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'No se pudo actualizar la mesa.'
        })
    } finally {
        connection.release()
    }
})
