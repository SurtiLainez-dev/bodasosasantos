<template>
  <section class="confirmed-section">
    <div class="confirmed-container">
      <p class="section-kicker">Celebramos contigo</p>
      <h2>Invitados confirmados</h2>

      <v-card class="confirmed-card" elevation="0">
        <div v-if="loading" class="loading">
          <v-progress-circular indeterminate />
        </div>

        <div v-else>
          <div
              v-for="item in invitados"
              :key="item.nombre"
              class="guest-row"
          >
            <span class="guest-name">
              {{ item.nombre }}
            </span>

            <span class="guest-count">
              {{ item.cantidad_confirmados }}
            </span>
          </div>

          <div class="total">
            Total asistentes:
            <strong>{{ total }}</strong>
          </div>
        </div>
      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data, pending } = await useFetch('/api/invitacion/confirmados')

const invitados = computed(() => data.value?.invitados || [])
const loading = computed(() => pending.value)

const total = computed(() => {
  return invitados.value.reduce((acc: number, i: any) => {
    return acc + Number(i.cantidad_confirmados || 0)
  }, 0)
})
</script>

<style scoped>
.confirmed-section {
  background: #EAF3FB;
  padding: 100px 24px;
}

.confirmed-container {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

/* TITULOS */
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #2984D1;
  font-size: 13px;
  margin-bottom: 14px;
}

h2 {
  font-family: Georgia, serif;
  font-size: clamp(38px, 5vw, 60px);
  font-weight: 400;
  color: #0C253C;
  margin-bottom: 40px;
}

/* CARD */
.confirmed-card {
  padding: 40px 30px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #9DC7EC;
  box-shadow: 0 20px 60px rgba(12, 37, 60, 0.12);
}

/* LISTA */
.guest-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 0;
  border-bottom: 1px solid rgba(157, 199, 236, 0.3);

  font-size: 18px;
}

.guest-name {
  text-align: left;
  color: #0C253C;
}

.guest-count {
  font-weight: 600;
  color: #236DAF;
}

/* TOTAL */
.total {
  margin-top: 20px;
  font-size: 18px;
  color: #133D62;
}

/* LOADING */
.loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

/* MOBILE */
@media (max-width: 768px) {
  .confirmed-card {
    padding: 30px 20px;
  }

  .guest-row {
    font-size: 16px;
  }
}
</style>
