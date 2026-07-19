import { db } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'
import type { RowDataPacket } from 'mysql2'

type MesaRow = RowDataPacket & {
    id: number
    capacidad: number
}

type InvitacionRow = RowDataPacket & {
    id: number
    nombre: string
    cantidad_confirmados: number | null
    respuesta_recibida: number | null
    respuesta: 'SI' | 'NO' | null
}

type ConteoRow = RowDataPacket & {
    total: number
}

export default defineEventHandler(async (event) => {

    await requireAdmin(event)
    let peps = 0;
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

        const [mesas] = await connection.execute<MesaRow[]>(
            `
                SELECT
                    id,
                    capacidad
                FROM mesas
                WHERE id = ?
                LIMIT 1
                FOR UPDATE
            `,
            [mesaId]
        )

        const mesa = mesas[0]

        if (!mesa) {
            throw createError({
                statusCode: 404,
                statusMessage: 'La mesa no fue encontrada.'
            })
        }

        const [invitaciones] =
            await connection.execute<InvitacionRow[]>(
                `
                    SELECT
                        id,
                        nombre,
                        cantidad_confirmados,
                        respuesta_recibida,
                        respuesta
                    FROM invitaciones
                    WHERE id = ?
                    LIMIT 1
                    FOR UPDATE
                `,
                [invitacionId]
            )

        const invitacion = invitaciones[0]

        if (!invitacion) {
            throw createError({
                statusCode: 404,
                statusMessage: 'La invitación no fue encontrada.'
            })
        }

        if (
            Number(invitacion.respuesta_recibida) !== 1 ||
            invitacion.respuesta !== 'SI'
        ) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    'Esta invitación no ha confirmado que asistirá.'
            })
        }

        const cantidadConfirmada = Number(
            invitacion.cantidad_confirmados || 0
        )

        if (cantidadConfirmada < 1) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    'La invitación no tiene personas confirmadas.'
            })
        }

        const [asignaciones] =
            await connection.execute<ConteoRow[]>(
                `
                    SELECT COUNT(*) AS total
                    FROM sillas
                    WHERE invitacion_id = ?
                    FOR UPDATE
                `,
                [invitacionId]
            )

        const totalAsignado = Number(
            asignaciones[0]?.total || 0
        )

        if (totalAsignado > 0) {
            throw createError({
                statusCode: 409,
                statusMessage:
                    'Esta invitación ya está asignada a una mesa.'
            })
        }

        const [ocupacion] =
            await connection.execute<ConteoRow[]>(
                `
                    SELECT COUNT(*) AS total
                    FROM sillas
                    WHERE mesa_id = ?
                    FOR UPDATE
                `,
                [mesaId]
            )

        const sillasOcupadas = Number(
            ocupacion[0]?.total || 0
        )

        const capacidad = Number(mesa.capacidad || 0)
        const disponibles = capacidad - sillasOcupadas

        if (cantidadConfirmada > disponibles) {
            throw createError({
                statusCode: 422,
                statusMessage:
                    `Esta invitación necesita ${cantidadConfirmada} lugares, ` +
                    `pero la mesa solamente tiene ${disponibles} disponibles.`
            })
        }

        for (
            let posicion = 1;
            posicion <= cantidadConfirmada;
            posicion++
        ) {
            await connection.execute(
                `
                    INSERT INTO sillas (
                        mesa_id,
                        invitacion_id,
                        nombre
                    )
                    VALUES (?, ?, ?)
                `,
                [
                    mesaId,
                    invitacionId,
                    posicion === 1
                        ? invitacion.nombre
                        : `Invitado ${posicion}`
                ]
            )
        }

        await connection.commit()

        return {
            success: true,
            message:
                `La invitación fue agregada con ` +
                `${cantidadConfirmada} lugares.`
        }
    } catch (error: any) {
        await connection.rollback()

        console.error('ERROR AL AGREGAR INVITACIÓN:', {
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
                'No se pudo agregar la invitación a la mesa.'
        })
    } finally {
        connection.release()
    }
})
