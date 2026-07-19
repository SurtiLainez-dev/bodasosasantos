import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'
type MesaRow = {
    id: number
    capacidad: number
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const mesaOrigenId = Number(
        getRouterParam(event, 'id')
    )

    const body = await readBody(event)

    const invitacionId = Number(body?.invitacion_id)
    const mesaDestinoId = Number(body?.mesa_destino_id)

    if (
        !mesaOrigenId ||
        !invitacionId ||
        !mesaDestinoId
    ) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'La invitación y la mesa de destino son obligatorias.'
        })
    }

    if (mesaOrigenId === mesaDestinoId) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'La mesa de destino debe ser diferente.'
        })
    }

    const connection = await db.getConnection()

    try {
        await connection.beginTransaction()

        const idsOrdenados = [
            mesaOrigenId,
            mesaDestinoId
        ].sort((a, b) => a - b)

        const [mesas] = await connection.query<MesaRow[]>(
            `
        SELECT
          id,
          capacidad
        FROM mesas
        WHERE id IN (?, ?)
        ORDER BY id
        FOR UPDATE
      `,
            idsOrdenados
        )

        const mesaOrigen = mesas.find(
            (mesa) => Number(mesa.id) === mesaOrigenId
        )

        const mesaDestino = mesas.find(
            (mesa) => Number(mesa.id) === mesaDestinoId
        )

        if (!mesaOrigen) {
            throw createError({
                statusCode: 404,
                statusMessage:
                    'La mesa de origen no fue encontrada.'
            })
        }

        if (!mesaDestino) {
            throw createError({
                statusCode: 404,
                statusMessage:
                    'La mesa de destino no fue encontrada.'
            })
        }

        const [sillasInvitacion]: any =
            await connection.execute(
                `
          SELECT COUNT(*) AS total
          FROM sillas
          WHERE mesa_id = ?
            AND invitacion_id = ?
          FOR UPDATE
        `,
                [
                    mesaOrigenId,
                    invitacionId
                ]
            )

        const cantidadMover = Number(
            sillasInvitacion[0]?.total || 0
        )

        if (cantidadMover < 1) {
            throw createError({
                statusCode: 404,
                statusMessage:
                    'La invitación no se encuentra en la mesa de origen.'
            })
        }

        const [ocupacionDestino]: any =
            await connection.execute(
                `
          SELECT COUNT(*) AS total
          FROM sillas
          WHERE mesa_id = ?
          FOR UPDATE
        `,
                [mesaDestinoId]
            )

        const ocupadasDestino = Number(
            ocupacionDestino[0]?.total || 0
        )

        const disponiblesDestino =
            Number(mesaDestino.capacidad || 0) -
            ocupadasDestino

        if (cantidadMover > disponiblesDestino) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    `La invitación ocupa ${cantidadMover} lugares, ` +
                    `pero la mesa de destino solamente tiene ` +
                    `${disponiblesDestino} disponibles.`
            })
        }

        await connection.execute(
            `
        UPDATE sillas
        SET mesa_id = ?
        WHERE mesa_id = ?
          AND invitacion_id = ?
      `,
            [
                mesaDestinoId,
                mesaOrigenId,
                invitacionId
            ]
        )

        await connection.commit()

        return {
            success: true,
            message:
                'La invitación fue movida correctamente.'
        }
    } catch (error: any) {
        await connection.rollback()

        console.error('ERROR AL MOVER INVITACIÓN:', error)

        if (error?.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage:
                'No se pudo mover la invitación.'
        })
    } finally {
        connection.release()
    }
})
