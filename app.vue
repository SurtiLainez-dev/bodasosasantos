<template>
  <WeddingGuestNotice
      v-if="showGuestNotice"
      message="Eres un invitado que no está en lista"
  />

  <WeddingEnvelopeIntro
      v-if="showEnvelope"
      :guest-name="guestName"
  />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import WeddingEnvelopeIntro from '~/components/WeddingEnvelopeIntro.vue'
import WeddingGuestNotice from '~/components/WeddingGuestNotice.vue'

const route = useRoute()

const guestName = ref('')
const tokenValid = ref(false)
const checkedToken = ref(false)
const visitaRegistrada = ref(false)

const isAdmin = computed(() => route.path.startsWith('/admin'))

const invitacionValida = useState('invitacionValida', () => false)
const invitacionData = useState<any>('invitacionData', () => null)

const { data } = await useFetch('/api/invitacion/token', {
  query: computed(() => ({
    token: route.query.token || ''
  })),
  server: false,
  watch: [() => route.query.token]
})

watchEffect(() => {
  checkedToken.value = true

  if (data.value?.ok && data.value?.invitacion) {
    guestName.value = data.value.invitacion.nombre
    tokenValid.value = true

    invitacionValida.value = true
    invitacionData.value = data.value.invitacion
  } else {
    guestName.value = ''
    tokenValid.value = false

    invitacionValida.value = false
    invitacionData.value = null
  }
})

const registrarVisita = async () => {
  if (isAdmin.value) return
  if (visitaRegistrada.value) return

  visitaRegistrada.value = true

  await $fetch('/api/visitas/create', {
    method: 'POST',
    body: {
      token: route.query.token || ''
    }
  })
}

onMounted(() => {
  registrarVisita()
})

watch(
    () => route.fullPath,
    () => {
      if (!isAdmin.value) {
        visitaRegistrada.value = false
        registrarVisita()
      }
    }
)

const showEnvelope = computed(() => {
  return !isAdmin.value && tokenValid.value
})

const showGuestNotice = computed(() => {
  return !isAdmin.value && checkedToken.value && !tokenValid.value
})
</script>
