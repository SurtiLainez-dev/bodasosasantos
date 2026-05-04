export default defineNuxtRouteMiddleware(async () => {
    try {
        await $fetch('/api/admin/me')
    } catch {
        return navigateTo('/admin/evento/login')
    }
})
