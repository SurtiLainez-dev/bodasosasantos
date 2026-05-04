// import bcrypt from 'bcrypt'
// import { db } from '~/server/utils/db'
//
// export default defineEventHandler(async (event) => {
//
//     // 🔒 protección simple (luego puedes quitar esto)
//     const query = getQuery(event)
//
//     if (query.key !== 'crear-usuarios-123') {
//         return { error: 'No autorizado' }
//     }
//
//     const users = [
//         {
//             usuario: 'AndreaSosa',
//             password: 'Andrea123'
//         },
//         {
//             usuario: 'WillySantos',
//             password: 'Willy123'
//         }
//     ]
//
//     for (const user of users) {
//         const hash = await bcrypt.hash(user.password, 10)
//
//         await db.query(
//             'INSERT INTO usuarios (usuario, password) VALUES (?, ?)',
//             [user.usuario, hash]
//         )
//     }
//
//     return { ok: true, message: 'Usuarios creados' }
// })
