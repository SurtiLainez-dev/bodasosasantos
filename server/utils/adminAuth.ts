import { db } from '~/server/utils/db'

export const requireAdmin = async (event: any) => {
    const userId = getCookie(event, 'admin_session')

    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'No autorizado'
        })
    }

    const [rows]: any = await db.query(
        'SELECT id, usuario FROM usuarios WHERE id = ? LIMIT 1',
        [userId]
    )

    if (!rows.length) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Sesión inválida'
        })
    }

    return rows[0]
}
