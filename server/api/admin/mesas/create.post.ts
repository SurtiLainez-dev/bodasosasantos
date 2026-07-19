import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'
export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const body = await readBody(event)

    const nombre = String(body?.nombre || '').trim()
    const numero = Number(body?.numero || 0)
    const capacidad = Number(body?.capacidad || 0)

    if (!numero || numero < 1) {
        throw createError({
            statusCode: 422,
            statusMessage: 'El número de la mesa debe ser mayor que cero.'
        })
    }

    if (!capacidad || capacidad < 1) {
        throw createError({
            statusCode: 422,
            statusMessage: 'La capacidad debe ser mayor que cero.'
        })
    }

    if (capacidad > 100) {
        throw createError({
            statusCode: 422,
            statusMessage: 'La capacidad máxima permitida es de 100 personas.'
        })
    }

    try {
        const [resultado]: any = await db.execute(
            `
        INSERT INTO mesas (
          nombre,
          numero,
          capacidad,
          created_at
        )
        VALUES (?, ?, ?, NOW())
      `,
            [
                nombre || `MESA ${numero}`,
                numero,
                capacidad
            ]
        )

        return {
            success: true,
            message: 'Mesa creada correctamente.',
            mesa_id: resultado.insertId
        }
    } catch (error: any) {
        console.error('ERROR AL CREAR MESA:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'No se pudo crear la mesa.'
        })
    }
})
