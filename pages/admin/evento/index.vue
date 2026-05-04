<template>
  <div>
    <p class="section-kicker">Resumen general</p>
    <h1>Panel del evento</h1>

    <v-row class="mt-8">
      <v-col
          v-for="item in cards"
          :key="item.title"
          cols="12"
          sm="6"
          md="4"
      >
        <v-card class="stat-card" elevation="0">
          <v-icon size="34" class="mb-4">{{ item.icon }}</v-icon>
          <h2>{{ item.value }}</h2>
          <p>{{ item.title }}</p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { data } = await useFetch('/api/admin/dashboard')

const stats = computed(() => data.value?.stats || {})

const cards = computed(() => [
  {
    title: 'Total permitido de invitados',
    value: stats.value.total_invitados || 0,
    icon: 'mdi-account-group-outline'
  },
  {
    title: 'Invitados confirmados',
    value: stats.value.invitados_confirmados || 0,
    icon: 'mdi-check-circle-outline'
  },
  {
    title: 'Invitaciones sin respuesta',
    value: stats.value.sin_respuesta || 0,
    icon: 'mdi-clock-outline'
  },
  {
    title: 'Invitaciones que no asistirán',
    value: stats.value.no_asisten || 0,
    icon: 'mdi-close-circle-outline'
  },
  {
    title: 'Cantidad de mesas',
    value: stats.value.total_mesas || 0,
    icon: 'mdi-table-chair'
  },
  {
    title: 'Invitados acomodados',
    value: stats.value.invitados_acomodados || 0,
    icon: 'mdi-seat-outline'
  },
  {
    title: 'Visitas a la invitación',
    value: stats.value.total_visitas || 0,
    icon: 'mdi-eye-outline'
  }
])
</script>

<style scoped>
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #9b7a55;
  font-size: 13px;
}

h1 {
  font-family: Georgia, serif;
  font-size: 48px;
  font-weight: 400;
  color: #2f2923;
}

.stat-card {
  padding: 30px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(199, 166, 125, 0.25);
  color: #8a643d;
}

.stat-card h2 {
  font-size: 42px;
  color: #2f2923;
}

.stat-card p {
  color: #5b5048;
}
</style>
