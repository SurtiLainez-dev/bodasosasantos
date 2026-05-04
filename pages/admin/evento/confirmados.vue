<template>
  <div>
    <div class="page-head">
      <div>
        <p class="section-kicker">Asistencia confirmada</p>
        <h1>Invitados confirmados</h1>
      </div>

      <v-btn variant="tonal" color="primary" rounded="xl" to="/admin/evento">
        <v-icon start>mdi-arrow-left</v-icon>
        Volver
      </v-btn>
    </div>

    <v-card class="list-card" elevation="0">
      <div class="summary">
        <span>Total confirmado</span>
        <strong>{{ totalConfirmados }}</strong>
      </div>

      <v-divider class="my-4" />

      <div
          v-for="item in invitados"
          :key="item.id"
          class="guest-row"
      >
        <div>
          <h3>{{ item.nombre }}</h3>
          <p>
            Código: {{ item.cod_reserva }}
            <span v-if="item.telefono"> · Tel: {{ item.telefono }}</span>
          </p>
        </div>

        <div class="guest-count">
          {{ item.cantidad_confirmados }}
        </div>
      </div>

      <div v-if="!invitados.length" class="empty">
        Aún no hay invitados confirmados.
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { data } = await useFetch('/api/admin/confirmados')

const invitados = computed(() => data.value?.invitados || [])

const totalConfirmados = computed(() => {
  return invitados.value.reduce((total: number, item: any) => {
    return total + Number(item.cantidad_confirmados || 0)
  }, 0)
})
</script>

<style scoped>
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 16px;
}

.section-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #2984d1;
  font-size: 13px;
}

h1 {
  font-family: Georgia, serif;
  font-size: 48px;
  font-weight: 400;
  color: #0c253c;
}

.list-card {
  padding: 28px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(157, 199, 236, 0.55);
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eaf3fb;
  border: 1px solid rgba(157, 199, 236, 0.55);
  border-radius: 22px;
  padding: 18px 22px;
  color: #133d62;
}

.summary strong {
  font-size: 34px;
  color: #0c253c;
}

.guest-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(157, 199, 236, 0.32);
}

.guest-row:last-child {
  border-bottom: 0;
}

.guest-row h3 {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 4px;
}

.guest-row p {
  color: #54708a;
  font-size: 14px;
}

.guest-count {
  min-width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #0c253c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.empty {
  padding: 40px 0;
  text-align: center;
  color: #54708a;
}

@media (max-width: 768px) {
  .page-head {
    flex-direction: column;
    align-items: stretch;
  }

  h1 {
    font-size: 38px;
  }

  .guest-row {
    align-items: flex-start;
  }
}
</style>
