import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
    const user = await requireAdmin(event)

    return {
        ok: true,
        user
    }
})
