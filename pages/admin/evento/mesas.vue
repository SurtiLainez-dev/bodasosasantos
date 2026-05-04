<template>
  <div>
    <div class="page-head">
      <div>
        <p class="section-kicker">Organización</p>
        <h1>Mesas</h1>
      </div>

      <v-btn color="primary" rounded="xl" @click="dialog = true">
        <v-icon start>mdi-plus</v-icon>
        Nueva mesa
      </v-btn>
    </div>

    <v-row>
      <v-col
          v-for="mesa in mesas"
          :key="mesa.id"
          cols="12"
          sm="6"
          md="4"
      >
        <v-card class="mesa-card" elevation="0">
          <v-icon size="36">mdi-table-chair</v-icon>
          <h2>{{ mesa.nombre || 'Mesa ' + mesa.numero }}</h2>
          <p>Número: {{ mesa.numero }}</p>
          <p>Capacidad: {{ mesa.capacidad }}</p>
          <p>Ocupadas: {{ mesa.sillas_ocupadas }}</p>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card class="form-card">
        <h2>Nueva mesa</h2>

        <v-text-field
            v-model="form.nombre"
            label="Nombre"
            variant="outlined"
        />

        <v-text-field
            v-model.number="form.numero"
            label="Número"
            type="number"
            variant="outlined"
        />

        <v-text-field
            v-model.number="form.capacidad"
            label="Capacidad"
            type="number"
            variant="outlined"
        />

        <v-btn block color="primary" rounded="xl" @click="crearMesa">
          Guardar mesa
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const dialog = ref(false)

const form = reactive({
  nombre: '',
  numero: 1,
  capacidad: 10
})

const { data, refresh } = await useFetch('/api/admin/mesas')

const mesas = computed(() => data.value?.mesas || [])

const crearMesa = async () => {
  await $fetch('/api/admin/mesas/create', {
    method: 'POST',
    body: form
  })

  dialog.value = false
  form.nombre = ''
  form.numero = 1
  form.capacidad = 10

  await refresh()
}
</script>

<style scoped>
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

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
}

.mesa-card,
.form-card {
  border-radius: 28px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(199, 166, 125, 0.25);
}

.mesa-card h2,
.form-card h2 {
  font-family: Georgia, serif;
  font-weight: 400;
  margin: 14px 0;
  color: #2f2923;
}
</style>
