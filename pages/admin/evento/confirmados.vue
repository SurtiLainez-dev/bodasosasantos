<template>
  <div>
    <div class="page-head">
      <div>
        <p class="section-kicker">Asistencia confirmada</p>
        <h1>Invitados confirmados</h1>
      </div>

      <v-btn
          variant="tonal"
          color="primary"
          rounded="xl"
          to="/admin/evento"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Volver
      </v-btn>
    </div>

    <!-- RESUMEN -->
    <div class="stats-grid">
      <v-card class="stat-card" elevation="0">
        <span>Total invitados</span>
        <strong>{{ totalConfirmados }}</strong>
      </v-card>

      <v-card class="stat-card novio-card" elevation="0">
        <span>Total invitados del novio</span>
        <strong>{{ totalNovio }}</strong>
      </v-card>

      <v-card class="stat-card novia-card" elevation="0">
        <span>Total invitados de la novia</span>
        <strong>{{ totalNovia }}</strong>
      </v-card>
    </div>

    <!-- TABLAS -->
    <div class="tables-grid">

      <!-- NOVIO -->
      <v-card class="list-card" elevation="0">
        <div class="table-head">
          <div>
            <p class="table-kicker">Lista del novio</p>
            <h2>Invitados del novio</h2>
          </div>

          <div class="mini-total">
            {{ totalNovio }}
          </div>
        </div>

        <v-divider class="my-4" />

        <div
            v-for="item in invitadosNovio"
            :key="item.id"
            class="guest-row"
        >
          <div>
            <h3>{{ item.nombre }}</h3>

            <p>
              Código: {{ item.cod_reserva }}

              <span v-if="item.telefono">
                · Tel: {{ item.telefono }}
              </span>
            </p>
          </div>

          <div class="guest-count">
            {{ item.cantidad_confirmados }}
          </div>
        </div>

        <div
            v-if="!invitadosNovio.length"
            class="empty"
        >
          No hay invitados confirmados del novio.
        </div>
      </v-card>

      <!-- NOVIA -->
      <v-card class="list-card" elevation="0">
        <div class="table-head">
          <div>
            <p class="table-kicker">Lista de la novia</p>
            <h2>Invitados de la novia</h2>
          </div>

          <div class="mini-total">
            {{ totalNovia }}
          </div>
        </div>

        <v-divider class="my-4" />

        <div
            v-for="item in invitadosNovia"
            :key="item.id"
            class="guest-row"
        >
          <div>
            <h3>{{ item.nombre }}</h3>

            <p>
              Código: {{ item.cod_reserva }}

              <span v-if="item.telefono">
                · Tel: {{ item.telefono }}
              </span>
            </p>
          </div>

          <div class="guest-count">
            {{ item.cantidad_confirmados }}
          </div>
        </div>

        <div
            v-if="!invitadosNovia.length"
            class="empty"
        >
          No hay invitados confirmados de la novia.
        </div>
      </v-card>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { data } = await useFetch('/api/admin/confirmados')

const invitados = computed(() => {
  return data.value?.invitados || []
})

const invitadosNovio = computed(() => {
  return invitados.value.filter((item: any) => {
    return item.tipo === 'novio'
  })
})

const invitadosNovia = computed(() => {
  return invitados.value.filter((item: any) => {
    return item.tipo === 'novia'
  })
})

const totalConfirmados = computed(() => {
  return invitados.value.reduce((total: number, item: any) => {
    return total + Number(item.cantidad_confirmados || 0)
  }, 0)
})

const totalNovio = computed(() => {
  return invitadosNovio.value.reduce((total: number, item: any) => {
    return total + Number(item.cantidad_confirmados || 0)
  }, 0)
})

const totalNovia = computed(() => {
  return invitadosNovia.value.reduce((total: number, item: any) => {
    return total + Number(item.cantidad_confirmados || 0)
  }, 0)
})
</script>

<style scoped>
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.section-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #2984d1;
  font-size: 13px;
}

h1 {
  font-family: Georgia, serif;
  font-size: 52px;
  font-weight: 400;
  color: #0c253c;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(157,199,236,.55);
  background: rgba(255,255,255,.9);
}

.stat-card span {
  display: block;
  color: #35587b;
  font-size: 15px;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 56px;
  color: #0c253c;
  line-height: 1;
}

.novio-card {
  background: #eaf3fb;
}

.novia-card {
  background: #f7edf3;
}

.tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.list-card {
  padding: 26px;
  border-radius: 28px;
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(157,199,236,.55);
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #2984d1;
  font-size: 13px;
  margin-bottom: 10px;
}

.table-head h2 {
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  color: #0c253c;
}

.mini-total {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0c253c;
  color: white;
  font-weight: 700;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guest-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(157,199,236,.25);
}

.guest-row:last-child {
  border-bottom: 0;
}

.guest-row h3 {
  font-family: Georgia, serif;
  color: #0c253c;
  font-size: 22px;
  margin-bottom: 4px;
}

.guest-row p {
  color: #6a8299;
  font-size: 14px;
}

.guest-count {
  min-width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #0c253c;
  color: white;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty {
  padding: 50px 0;
  text-align: center;
  color: #6a8299;
}

@media (max-width: 960px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tables-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-head {
    flex-direction: column;
    align-items: stretch;
  }

  h1 {
    font-size: 38px;
  }

  .stat-card strong {
    font-size: 42px;
  }

  .guest-row {
    align-items: flex-start;
  }
}
</style>
