import bcrypt from 'bcrypt'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const usuario = String(body.usuario || '').trim()
    const password = String(body.password || '')

    if (!usuario || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes ingresar usuario y contraseña'
        })
    }

    const [rows]: any = await db.query(
        `SELECT id, usuario, password 
     FROM usuarios 
     WHERE usuario = ? 
     LIMIT 1`,
        [usuario]
    )

    if (!rows || rows.length === 0) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Usuario o contraseña incorrectos'
        })
    }

    const user = rows[0]

    const passwordOk = await bcrypt.compare(password, user.password)

    if (!passwordOk) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Usuario o contraseña incorrectos'
        })
    }

    setCookie(event, 'admin_session', String(user.id), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8
    })

    return {
        ok: true,
        user: {
            id: user.id,
            usuario: user.usuario
        }
    }
})
