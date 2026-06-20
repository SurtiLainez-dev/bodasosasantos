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

    <div class="stats-grid">
      <v-card class="stat-card" elevation="0">
        <span>Total invitados</span>
        <strong>{{ totalConfirmados }}</strong>
      </v-card>

      <v-card class="stat-card novio" elevation="0">
        <span>Total invitados del novio</span>
        <strong>{{ totalNovio }}</strong>
      </v-card>

      <v-card class="stat-card novia" elevation="0">
        <span>Total invitados de la novia</span>
        <strong>{{ totalNovia }}</strong>
      </v-card>
    </div>

    <div class="tables-grid">
      <v-card class="list-card" elevation="0">
        <div class="table-head">
          <div>
            <p class="table-kicker">Lista del novio</p>
            <h2>Invitados del novio</h2>
          </div>
          <div class="mini-total">{{ totalNovio }}</div>
        </div>

        <v-divider class="my-4" />

        <div v-for="item in invitadosNovio" :key="item.id" class="guest-row">
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

        <div v-if="!invitadosNovio.length" class="empty">
          Aún no hay invitados confirmados del novio.
        </div>
      </v-card>

      <v-card class="list-card" elevation="0">
        <div class="table-head">
          <div>
            <p class="table-kicker">Lista de la novia</p>
            <h2>Invitados de la novia</h2>
          </div>
          <div class="mini-total">{{ totalNovia }}</div>
        </div>

        <v-divider class="my-4" />

        <div v-for="item in invitadosNovia" :key="item.id" class="guest-row">
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

        <div v-if="!invitadosNovia.length" class="empty">
          Aún no hay invitados confirmados de la novia.
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

const invitados = computed(() => data.value?.invitados || [])

const getGrupo = (item: any) => {
  return String(
      item.lado ||
      item.tipo ||
      item.grupo ||
      item.invitado_de ||
      item.familia ||
      ''
  ).toLowerCase()
}

const invitadosNovio = computed(() => {
  return invitados.value.filter((item: any) => {
    const grupo = getGrupo(item)
    return grupo.includes('novio')
  })
})

const invitadosNovia = computed(() => {
  return invitados.value.filter((item: any) => {
    const grupo = getGrupo(item)
    return grupo.includes('novia')
  })
})

const sumarConfirmados = (lista: any[]) => {
  return lista.reduce((total: number, item: any) => {
    return total + Number(item.cantidad_confirmados || 0)
  }, 0)
}

const totalConfirmados = computed(() => sumarConfirmados(invitados.value))
const totalNovio = computed(() => sumarConfirmados(invitadosNovio.value))
const totalNovia = computed(() => sumarConfirmados(invitadosNovia.value))
</script>

<style scoped>
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 16px;
}

.section-kicker,
.table-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #2984d1;
  font-size: 13px;
  margin-bottom: 4px;
}

h1 {
  font-family: Georgia, serif;
  font-size: 48px;
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
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(157, 199, 236, 0.55);
  color: #133d62;
}

.stat-card span {
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-card strong {
  display: block;
  font-size: 42px;
  line-height: 1;
  color: #0c253c;
}

.stat-card.novio {
  background: #eaf3fb;
}

.stat-card.novia {
  background: #f7edf3;
  border-color: rgba(213, 166, 193, 0.55);
}

.tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.list-card {
  padding: 26px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(157, 199, 236, 0.55);
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.table-head h2 {
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
  color: #0c253c;
}

.mini-total {
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
  font-size: 22px;
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 4px;
}

.guest-row p {
  color: #54708a;
  font-size: 14px;
}

.guest-count {
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #0c253c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  font-weight: 700;
}

.empty {
  padding: 40px 0;
  text-align: center;
  color: #54708a;
}

@media (max-width: 960px) {
  .stats-grid,
  .tables-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .page-head {
    flex-direction: column;
    align-items: stretch;
  }

  h1 {
    font-size: 36px;
  }

  .stat-card {
    padding: 20px;
    border-radius: 24px;
  }

  .stat-card strong {
    font-size: 38px;
  }

  .list-card {
    padding: 20px;
    border-radius: 24px;
  }

  .table-head h2 {
    font-size: 26px;
  }

  .guest-row {
    align-items: flex-start;
  }

  .guest-row h3 {
    font-size: 20px;
  }
}
</style>
