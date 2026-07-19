import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const mesaId = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const invitacionId = Number(body?.invitacion_id)

    if (!mesaId || !invitacionId) {
        throw createError({
            statusCode: 422,
            statusMessage: 'La mesa y la invitación son obligatorias.'
        })
    }

    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        const [sillas]: any = await connection.execute(
            `
                SELECT id
                FROM sillas
                WHERE mesa_id = ?
                  AND invitacion_id = ?
                FOR UPDATE
            `,
            [mesaId, invitacionId]
        )

        if (!sillas.length) {
            throw createError({
                statusCode: 404,
                statusMessage:
                    'La invitación no está asignada a esta mesa.'
            })
        }

        await connection.execute(
            `
                DELETE FROM sillas
                WHERE mesa_id = ?
                  AND invitacion_id = ?
            `,
            [mesaId, invitacionId]
        )

        await connection.commit()

        return {
            success: true,
            message: 'La invitación fue retirada de la mesa.'
        }
    } catch (error: any) {
        await connection.rollback()

        console.error('ERROR AL QUITAR INVITACIÓN:', {
            message: error?.message,
            code: error?.code,
            sqlMessage: error?.sqlMessage,
            stack: error?.stack
        })

        if (error?.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage:
                error?.sqlMessage ||
                error?.message ||
                'No se pudo retirar la invitación de la mesa.'
        })
    } finally {
        connection.release()
    }
})
