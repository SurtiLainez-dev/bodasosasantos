<template>
  <div class="mesas-page">
    <div class="page-head">
      <div class="page-head-info">
        <p class="section-kicker">
          Organización
        </p>

        <h1>Mesas</h1>

        <p class="page-description">
          Organiza a los invitados y administra los lugares
          disponibles en cada mesa.
        </p>
      </div>

      <div class="header-actions">
        <v-btn
            variant="tonal"
            color="primary"
            rounded="xl"
            prepend-icon="mdi-arrow-left"
            to="/admin/evento"
        >
          Volver
        </v-btn>

        <v-btn
            color="primary"
            rounded="xl"
            prepend-icon="mdi-plus"
            @click="abrirNuevaMesa"
        >
          Nueva mesa
        </v-btn>
      </div>
    </div>

    <div
        v-if="pendingMesas"
        class="loading-container"
    >
      <v-progress-circular
          indeterminate
          color="primary"
          size="48"
      />

      <p>Cargando mesas...</p>
    </div>

    <v-row v-else>
      <v-col
          v-for="mesa in mesas"
          :key="mesa.id"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
      >
        <v-card
            class="mesa-card"
            elevation="0"
            tabindex="0"
            role="button"
            @click="abrirMesa(mesa)"
            @keydown.enter="abrirMesa(mesa)"
        >
          <div class="mesa-card-header">
            <div class="mesa-icon">
              <v-icon size="30">
                mdi-table-chair
              </v-icon>
            </div>

            <v-chip
                size="small"
                :color="colorOcupacion(mesa)"
                variant="tonal"
            >
              {{ mesa.sillas_ocupadas }}/{{ mesa.capacidad }}
            </v-chip>
          </div>

          <h2>
            {{ mesa.nombre || `Mesa ${mesa.numero}` }}
          </h2>

          <p class="mesa-number">
            Mesa número {{ mesa.numero }}
          </p>

          <v-progress-linear
              class="mesa-progress"
              :model-value="mesa.porcentaje_ocupacion"
              :color="colorOcupacion(mesa)"
              height="8"
              rounded
          />

          <div class="mesa-stats">
            <div>
              <span>Ocupadas</span>
              <strong>
                {{ mesa.sillas_ocupadas }}
              </strong>
            </div>

            <div>
              <span>Disponibles</span>
              <strong>
                {{ mesa.sillas_disponibles }}
              </strong>
            </div>

            <div>
              <span>Capacidad</span>
              <strong>
                {{ mesa.capacidad }}
              </strong>
            </div>
          </div>

          <v-btn
              class="open-button"
              block
              rounded="xl"
              variant="tonal"
              color="primary"
              prepend-icon="mdi-account-group-outline"
          >
            Administrar mesa
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <div
        v-if="!pendingMesas && mesas.length === 0"
        class="empty-state"
    >
      <v-icon size="64">
        mdi-table-chair
      </v-icon>

      <h2>No hay mesas creadas</h2>

      <p>
        Crea la primera mesa para comenzar a organizar
        a los invitados.
      </p>

      <v-btn
          color="primary"
          rounded="xl"
          prepend-icon="mdi-plus"
          @click="abrirNuevaMesa"
      >
        Crear mesa
      </v-btn>
    </div>

    <!-- Modal crear mesa -->
    <v-dialog
        v-model="dialogNuevaMesa"
        max-width="520"
    >
      <v-card
          class="form-card"
          rounded="xl"
      >
        <div class="dialog-title-row">
          <div>
            <p class="dialog-kicker">
              Organización
            </p>

            <h2>Nueva mesa</h2>
          </div>

          <v-btn
              icon="mdi-close"
              variant="text"
              @click="dialogNuevaMesa = false"
          />
        </div>

        <v-form @submit.prevent="crearMesa">
          <v-text-field
              v-model="formNuevaMesa.nombre"
              label="Nombre de la mesa"
              placeholder="Ejemplo: Familia del novio"
              variant="outlined"
              prepend-inner-icon="mdi-table-furniture"
          />

          <v-row>
            <v-col
                cols="12"
                sm="6"
            >
              <v-text-field
                  v-model.number="formNuevaMesa.numero"
                  label="Número"
                  type="number"
                  min="1"
                  variant="outlined"
                  prepend-inner-icon="mdi-numeric"
              />
            </v-col>

            <v-col
                cols="12"
                sm="6"
            >
              <v-text-field
                  v-model.number="formNuevaMesa.capacidad"
                  label="Capacidad"
                  type="number"
                  min="1"
                  variant="outlined"
                  prepend-inner-icon="mdi-seat"
              />
            </v-col>
          </v-row>

          <div class="dialog-actions">
            <v-btn
                variant="text"
                rounded="xl"
                @click="dialogNuevaMesa = false"
            >
              Cancelar
            </v-btn>

            <v-btn
                type="submit"
                color="primary"
                rounded="xl"
                prepend-icon="mdi-content-save"
                :loading="guardandoMesa"
            >
              Guardar mesa
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Modal administrar mesa -->
    <v-dialog
        v-model="dialogMesa"
        :fullscreen="smAndDown"
        max-width="1050"
        scrollable
    >
      <v-card
          class="mesa-dialog"
          rounded="xl"
      >
        <div class="mesa-dialog-header">
          <div>
            <p class="dialog-kicker">
              Mesa {{ mesaSeleccionada?.numero }}
            </p>

            <h2>
              {{ mesaSeleccionada?.nombre }}
            </h2>

            <p
                v-if="mesaSeleccionada"
                class="dialog-subtitle"
            >
              {{ mesaSeleccionada.sillas_ocupadas }}
              lugares ocupados de
              {{ mesaSeleccionada.capacidad }}
            </p>
          </div>

          <v-btn
              icon="mdi-close"
              variant="text"
              @click="cerrarMesa"
          />
        </div>

        <v-tabs
            v-model="tabMesa"
            color="primary"
            grow
        >
          <v-tab value="invitados">
            <v-icon start>
              mdi-account-group-outline
            </v-icon>

            Invitados
          </v-tab>

          <v-tab value="editar">
            <v-icon start>
              mdi-pencil-outline
            </v-icon>

            Editar mesa
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-card-text class="mesa-dialog-content">
          <div
              v-if="cargandoDetalle"
              class="loading-container"
          >
            <v-progress-circular
                indeterminate
                color="primary"
            />
          </div>

          <v-window
              v-else
              v-model="tabMesa"
          >
            <v-window-item value="invitados">
              <div
                  v-if="mesaSeleccionada"
                  class="summary-grid"
              >
                <div class="summary-item">
                  <span>Capacidad</span>

                  <strong>
                    {{ mesaSeleccionada.capacidad }}
                  </strong>
                </div>

                <div class="summary-item">
                  <span>Ocupadas</span>

                  <strong>
                    {{ mesaSeleccionada.sillas_ocupadas }}
                  </strong>
                </div>

                <div class="summary-item">
                  <span>Disponibles</span>

                  <strong>
                    {{ mesaSeleccionada.sillas_disponibles }}
                  </strong>
                </div>
              </div>

              <v-progress-linear
                  v-if="mesaSeleccionada"
                  class="detail-progress"
                  :model-value="
                  mesaSeleccionada.porcentaje_ocupacion
                "
                  :color="
                  colorOcupacion(mesaSeleccionada)
                "
                  height="10"
                  rounded
              />

              <div class="section-toolbar">
                <div>
                  <h3>Invitaciones asignadas</h3>

                  <p>
                    Cada persona confirmada ocupa una silla.
                  </p>
                </div>

                <v-btn
                    color="primary"
                    rounded="xl"
                    prepend-icon="mdi-account-plus-outline"
                    :disabled="
                    !mesaSeleccionada ||
                    mesaSeleccionada.sillas_disponibles < 1
                  "
                    @click="abrirAgregarInvitacion"
                >
                  Agregar invitación
                </v-btn>
              </div>

              <div
                  v-if="
                  mesaSeleccionada?.invitaciones?.length
                "
                  class="guest-list"
              >
                <v-card
                    v-for="invitacion in
                    mesaSeleccionada.invitaciones"
                    :key="invitacion.id"
                    class="guest-card"
                    elevation="0"
                >
                  <div class="guest-card-header">
                    <div class="guest-main-info">
                      <div class="guest-avatar">
                        <v-icon>
                          mdi-account-group
                        </v-icon>
                      </div>

                      <div>
                        <h4>
                          {{ invitacion.nombre }}
                        </h4>

                        <p>
                          Código:
                          {{ invitacion.cod_reserva }}
                        </p>
                      </div>
                    </div>

                    <v-chip
                        color="primary"
                        variant="tonal"
                    >
                      {{ invitacion.cantidad_sillas }}
                      lugares
                    </v-chip>
                  </div>

                  <div class="chair-names">
                    <p class="chair-title">
                      Nombres de las personas
                    </p>

                    <v-text-field
                        v-for="(
                        silla,
                        sillaIndex
                      ) in invitacion.sillas"
                        :key="silla.id"
                        v-model="silla.nombre"
                        :label="`Persona ${sillaIndex + 1}`"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account-outline"
                        hide-details="auto"
                    />
                  </div>

                  <div class="guest-actions">
                    <v-btn
                        variant="tonal"
                        color="primary"
                        rounded="xl"
                        prepend-icon="mdi-content-save-outline"
                        :loading="
                        guardandoSillasInvitacionId ===
                        invitacion.id
                      "
                        @click="
                        guardarNombresSillas(invitacion)
                      "
                    >
                      Guardar nombres
                    </v-btn>

                    <v-btn
                        variant="tonal"
                        color="info"
                        rounded="xl"
                        prepend-icon="mdi-swap-horizontal"
                        @click="
                        abrirMoverInvitacion(invitacion)
                      "
                    >
                      Mover
                    </v-btn>

                    <v-btn
                        variant="tonal"
                        color="error"
                        rounded="xl"
                        prepend-icon="mdi-account-minus-outline"
                        @click="
                        confirmarQuitarInvitacion(invitacion)
                      "
                    >
                      Quitar
                    </v-btn>
                  </div>
                </v-card>
              </div>

              <div
                  v-else
                  class="empty-guests"
              >
                <v-icon size="54">
                  mdi-account-group-outline
                </v-icon>

                <h3>Esta mesa está vacía</h3>

                <p>
                  Agrega una invitación para comenzar
                  a ocupar los lugares.
                </p>
              </div>
            </v-window-item>

            <v-window-item value="editar">
              <div class="edit-section">
                <div class="edit-heading">
                  <h3>Información de la mesa</h3>

                  <p>
                    Puedes cambiar el nombre, número
                    y capacidad de la mesa.
                  </p>
                </div>

                <v-form
                    @submit.prevent="actualizarMesa"
                >
                  <v-text-field
                      v-model="formEditarMesa.nombre"
                      label="Nombre de la mesa"
                      variant="outlined"
                      prepend-inner-icon="mdi-table-furniture"
                  />

                  <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                    >
                      <v-text-field
                          v-model.number="
                          formEditarMesa.numero
                        "
                          label="Número"
                          type="number"
                          min="1"
                          variant="outlined"
                          prepend-inner-icon="mdi-numeric"
                      />
                    </v-col>

                    <v-col
                        cols="12"
                        sm="6"
                    >
                      <v-text-field
                          v-model.number="
                          formEditarMesa.capacidad
                        "
                          label="Capacidad"
                          type="number"
                          min="1"
                          variant="outlined"
                          prepend-inner-icon="mdi-seat"
                          :hint="
                          mesaSeleccionada
                            ? `Actualmente hay ${mesaSeleccionada.sillas_ocupadas} lugares ocupados.`
                            : ''
                        "
                          persistent-hint
                      />
                    </v-col>
                  </v-row>

                  <v-alert
                      v-if="
                      mesaSeleccionada &&
                      formEditarMesa.capacidad <
                        mesaSeleccionada.sillas_ocupadas
                    "
                      type="warning"
                      variant="tonal"
                      class="mb-5"
                  >
                    La capacidad no puede ser menor
                    que la cantidad de lugares ocupados.
                  </v-alert>

                  <div class="edit-actions">
                    <v-btn
                        type="submit"
                        color="primary"
                        rounded="xl"
                        prepend-icon="mdi-content-save"
                        :loading="actualizandoMesa"
                    >
                      Guardar cambios
                    </v-btn>
                  </div>
                </v-form>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal agregar invitación -->
    <v-dialog
        v-model="dialogAgregarInvitacion"
        max-width="650"
    >
      <v-card
          class="form-card"
          rounded="xl"
      >
        <div class="dialog-title-row">
          <div>
            <p class="dialog-kicker">
              Agregar a la mesa
            </p>

            <h2>Seleccionar invitación</h2>
          </div>

          <v-btn
              icon="mdi-close"
              variant="text"
              @click="dialogAgregarInvitacion = false"
          />
        </div>

        <v-text-field
            v-model="buscarInvitacion"
            label="Buscar invitación"
            placeholder="Nombre o código de reserva"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
        />

        <div
            v-if="cargandoInvitaciones"
            class="loading-container"
        >
          <v-progress-circular
              indeterminate
              color="primary"
          />
        </div>

        <div
            v-else-if="
            invitacionesDisponiblesFiltradas.length
          "
            class="available-list"
        >
          <v-card
              v-for="invitacion in
              invitacionesDisponiblesFiltradas"
              :key="invitacion.id"
              class="available-card"
              elevation="0"
              @click="
              invitacionSeleccionadaId =
                invitacion.id
            "
          >
            <v-radio
                v-model="invitacionSeleccionadaId"
                :value="invitacion.id"
                color="primary"
                hide-details
            />

            <div class="available-info">
              <h4>
                {{ invitacion.nombre }}
              </h4>

              <p>
                Código: {{ invitacion.cod_reserva }}
              </p>

              <span>
                Esta invitación tiene
                <strong>
                  {{ invitacion.cantidad_confirmados }}
                </strong>
                personas confirmadas.
              </span>
            </div>

            <v-chip
                :color="
                invitacion.cantidad_confirmados <=
                (mesaSeleccionada?.sillas_disponibles || 0)
                  ? 'success'
                  : 'error'
              "
                variant="tonal"
            >
              {{ invitacion.cantidad_confirmados }}
              lugares
            </v-chip>
          </v-card>
        </div>

        <div
            v-else
            class="empty-guests"
        >
          <v-icon size="48">
            mdi-account-search-outline
          </v-icon>

          <h3>No hay invitaciones disponibles</h3>

          <p>
            Todas las invitaciones confirmadas
            ya fueron asignadas o no coinciden
            con la búsqueda.
          </p>
        </div>

        <div class="dialog-actions">
          <v-btn
              variant="text"
              rounded="xl"
              @click="dialogAgregarInvitacion = false"
          >
            Cancelar
          </v-btn>

          <v-btn
              color="primary"
              rounded="xl"
              prepend-icon="mdi-account-plus"
              :disabled="!puedeAgregarInvitacion"
              :loading="agregandoInvitacion"
              @click="agregarInvitacion"
          >
            Agregar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Modal mover invitación -->
    <v-dialog
        v-model="dialogMoverInvitacion"
        max-width="550"
    >
      <v-card
          class="form-card"
          rounded="xl"
      >
        <div class="dialog-title-row">
          <div>
            <p class="dialog-kicker">
              Cambiar ubicación
            </p>

            <h2>Mover invitación</h2>
          </div>

          <v-btn
              icon="mdi-close"
              variant="text"
              @click="dialogMoverInvitacion = false"
          />
        </div>

        <v-alert
            v-if="invitacionParaMover"
            type="info"
            variant="tonal"
            class="mb-5"
        >
          <strong>
            {{ invitacionParaMover.nombre }}
          </strong>
          ocupa
          {{ invitacionParaMover.cantidad_sillas }}
          lugares.
        </v-alert>

        <v-select
            v-model="mesaDestinoId"
            :items="mesasDestinoDisponibles"
            item-title="titulo"
            item-value="id"
            label="Mesa de destino"
            variant="outlined"
            prepend-inner-icon="mdi-table-chair"
            no-data-text="No hay mesas disponibles"
        />

        <div class="dialog-actions">
          <v-btn
              variant="text"
              rounded="xl"
              @click="dialogMoverInvitacion = false"
          >
            Cancelar
          </v-btn>

          <v-btn
              color="primary"
              rounded="xl"
              prepend-icon="mdi-swap-horizontal"
              :disabled="!mesaDestinoId"
              :loading="moviendoInvitacion"
              @click="moverInvitacion"
          >
            Mover invitación
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Confirmar quitar invitación -->
    <v-dialog
        v-model="dialogQuitarInvitacion"
        max-width="500"
    >
      <v-card
          class="form-card"
          rounded="xl"
      >
        <div class="confirm-icon error-icon">
          <v-icon size="36">
            mdi-account-minus-outline
          </v-icon>
        </div>

        <h2 class="confirm-title">
          Quitar invitación
        </h2>

        <p class="confirm-text">
          ¿Deseas quitar a
          <strong>
            {{ invitacionParaQuitar?.nombre }}
          </strong>
          de esta mesa?
        </p>

        <p class="confirm-text">
          Se liberarán
          {{ invitacionParaQuitar?.cantidad_sillas || 0 }}
          lugares.
        </p>

        <div class="dialog-actions">
          <v-btn
              variant="text"
              rounded="xl"
              @click="dialogQuitarInvitacion = false"
          >
            Cancelar
          </v-btn>

          <v-btn
              color="error"
              rounded="xl"
              prepend-icon="mdi-account-minus"
              :loading="quitandoInvitacion"
              @click="quitarInvitacion"
          >
            Sí, quitar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar
        v-model="snackbar.visible"
        :color="snackbar.color"
        location="top right"
        :timeout="4500"
    >
      {{ snackbar.texto }}

      <template #actions>
        <v-btn
            icon="mdi-close"
            variant="text"
            @click="snackbar.visible = false"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

type Silla = {
  id: number
  nombre: string
}

type InvitacionMesa = {
  id: number
  nombre: string
  cod_reserva: string
  cantidad_confirmados: number
  cantidad_sillas: number
  sillas: Silla[]
}

type Mesa = {
  id: number
  nombre: string
  numero: number
  capacidad: number
  sillas_ocupadas: number
  sillas_disponibles: number
  porcentaje_ocupacion: number
  invitaciones?: InvitacionMesa[]
}

type InvitacionDisponible = {
  id: number
  nombre: string
  cod_reserva: string
  cantidad_confirmados: number
  telefono?: string | null
}

const { smAndDown } = useDisplay()

const dialogNuevaMesa = ref(false)
const dialogMesa = ref(false)
const dialogAgregarInvitacion = ref(false)
const dialogMoverInvitacion = ref(false)
const dialogQuitarInvitacion = ref(false)

const tabMesa = ref<'invitados' | 'editar'>(
    'invitados'
)

const guardandoMesa = ref(false)
const actualizandoMesa = ref(false)
const cargandoDetalle = ref(false)
const cargandoInvitaciones = ref(false)
const agregandoInvitacion = ref(false)
const moviendoInvitacion = ref(false)
const quitandoInvitacion = ref(false)

const guardandoSillasInvitacionId =
    ref<number | null>(null)

const mesaSeleccionada = ref<Mesa | null>(null)

const invitacionesDisponibles =
    ref<InvitacionDisponible[]>([])

const invitacionSeleccionadaId =
    ref<number | null>(null)

const invitacionParaMover =
    ref<InvitacionMesa | null>(null)

const invitacionParaQuitar =
    ref<InvitacionMesa | null>(null)

const mesaDestinoId = ref<number | null>(null)
const buscarInvitacion = ref('')

const formNuevaMesa = reactive({
  nombre: '',
  numero: 1,
  capacidad: 10
})

const formEditarMesa = reactive({
  nombre: '',
  numero: 1,
  capacidad: 10
})

const snackbar = reactive({
  visible: false,
  texto: '',
  color: 'success'
})

const {
  data,
  pending: pendingMesas,
  refresh: refreshMesas
} = await useFetch<{ mesas: Mesa[] }>(
    '/api/admin/mesas',
    {
      default: () => ({
        mesas: []
      })
    }
)

const mesas = computed<Mesa[]>(() => {
  return data.value?.mesas || []
})

const invitacionesDisponiblesFiltradas =
    computed(() => {
      const texto = buscarInvitacion.value
          .trim()
          .toLowerCase()

      if (!texto) {
        return invitacionesDisponibles.value
      }

      return invitacionesDisponibles.value.filter(
          (invitacion) => {
            return (
                invitacion.nombre
                    .toLowerCase()
                    .includes(texto) ||
                String(invitacion.cod_reserva)
                    .toLowerCase()
                    .includes(texto)
            )
          }
      )
    })

const invitacionSeleccionada = computed(() => {
  return invitacionesDisponibles.value.find(
      (invitacion) =>
          invitacion.id ===
          invitacionSeleccionadaId.value
  )
})

const puedeAgregarInvitacion = computed(() => {
  if (
      !mesaSeleccionada.value ||
      !invitacionSeleccionada.value
  ) {
    return false
  }

  return (
      invitacionSeleccionada.value
          .cantidad_confirmados <=
      mesaSeleccionada.value.sillas_disponibles
  )
})

const mesasDestinoDisponibles = computed(() => {
  if (
      !mesaSeleccionada.value ||
      !invitacionParaMover.value
  ) {
    return []
  }

  return mesas.value
      .filter((mesa) => {
        return (
            mesa.id !== mesaSeleccionada.value?.id &&
            mesa.sillas_disponibles >=
            invitacionParaMover.value!.cantidad_sillas
        )
      })
      .map((mesa) => ({
        id: mesa.id,
        titulo:
            `${mesa.nombre || `Mesa ${mesa.numero}`} ` +
            `- ${mesa.sillas_disponibles} disponibles`
      }))
})

const mostrarMensaje = (
    texto: string,
    color = 'success'
) => {
  snackbar.texto = texto
  snackbar.color = color
  snackbar.visible = true
}

const obtenerMensajeError = (
    error: any,
    mensajeDefault: string
) => {
  return (
      error?.data?.statusMessage ||
      error?.data?.message ||
      error?.statusMessage ||
      error?.message ||
      mensajeDefault
  )
}

const colorOcupacion = (mesa: Mesa) => {
  const porcentaje =
      Number(mesa.porcentaje_ocupacion || 0)

  if (porcentaje >= 100) {
    return 'error'
  }

  if (porcentaje >= 80) {
    return 'warning'
  }

  return 'success'
}

const abrirNuevaMesa = () => {
  const ultimoNumero = mesas.value.reduce(
      (maximo, mesa) =>
          Math.max(maximo, Number(mesa.numero || 0)),
      0
  )

  formNuevaMesa.nombre = ''
  formNuevaMesa.numero = ultimoNumero + 1
  formNuevaMesa.capacidad = 10

  dialogNuevaMesa.value = true
}

const crearMesa = async () => {
  if (formNuevaMesa.numero < 1) {
    mostrarMensaje(
        'El número debe ser mayor que cero.',
        'error'
    )

    return
  }

  if (formNuevaMesa.capacidad < 1) {
    mostrarMensaje(
        'La capacidad debe ser mayor que cero.',
        'error'
    )

    return
  }

  guardandoMesa.value = true

  try {
    const respuesta = await $fetch<any>(
        '/api/admin/mesas/create',
        {
          method: 'POST',
          body: {
            nombre: formNuevaMesa.nombre,
            numero: formNuevaMesa.numero,
            capacidad: formNuevaMesa.capacidad
          }
        }
    )

    dialogNuevaMesa.value = false

    await refreshMesas()

    mostrarMensaje(
        respuesta?.message ||
        'Mesa creada correctamente.'
    )
  } catch (error: any) {
    mostrarMensaje(
        obtenerMensajeError(
            error,
            'No se pudo crear la mesa.'
        ),
        'error'
    )
  } finally {
    guardandoMesa.value = false
  }
}

const abrirMesa = async (mesa: Mesa) => {
  mesaSeleccionada.value = {
    ...mesa,
    invitaciones: []
  }

  tabMesa.value = 'invitados'
  dialogMesa.value = true

  await cargarDetalleMesa(mesa.id)
}

const cargarDetalleMesa = async (
    mesaId?: number
) => {
  const id =
      mesaId || mesaSeleccionada.value?.id

  if (!id) {
    return
  }

  cargandoDetalle.value = true

  try {
    const respuesta = await $fetch<{
      mesa: Mesa
    }>(`/api/admin/mesas/${id}`)

    mesaSeleccionada.value =
        respuesta.mesa

    formEditarMesa.nombre =
        respuesta.mesa.nombre || ''

    formEditarMesa.numero =
        respuesta.mesa.numero

    formEditarMesa.capacidad =
        respuesta.mesa.capacidad
  } catch (error: any) {
    mostrarMensaje(
        obtenerMensajeError(
            error,
            'No se pudo cargar la mesa.'
        ),
        'error'
    )
  } finally {
    cargandoDetalle.value = false
  }
}

const cerrarMesa = () => {
  dialogMesa.value = false
  mesaSeleccionada.value = null
  tabMesa.value = 'invitados'
}

const abrirAgregarInvitacion = async () => {
  invitacionSeleccionadaId.value = null
  buscarInvitacion.value = ''
  dialogAgregarInvitacion.value = true

  await cargarInvitacionesDisponibles()
}

const cargarInvitacionesDisponibles =
    async () => {
      cargandoInvitaciones.value = true

      try {
        const respuesta = await $fetch<{
          invitaciones: InvitacionDisponible[]
        }>(
            '/api/admin/mesas/invitaciones-disponibles'
        )

        invitacionesDisponibles.value =
            respuesta.invitaciones || []
      } catch (error: any) {
        mostrarMensaje(
            obtenerMensajeError(
                error,
                'No se pudieron cargar las invitaciones.'
            ),
            'error'
        )
      } finally {
        cargandoInvitaciones.value = false
      }
    }

const agregarInvitacion = async () => {
  if (
      !mesaSeleccionada.value ||
      !invitacionSeleccionadaId.value
  ) {
    return
  }

  agregandoInvitacion.value = true

  try {
    const respuesta = await $fetch<any>(
        `/api/admin/mesas/${mesaSeleccionada.value.id}/agregar-invitacion`,
        {
          method: 'POST',
          body: {
            invitacion_id:
            invitacionSeleccionadaId.value
          }
        }
    )

    dialogAgregarInvitacion.value = false

    await Promise.all([
      cargarDetalleMesa(),
      refreshMesas()
    ])

    mostrarMensaje(
        respuesta?.message ||
        'Invitación agregada correctamente.'
    )
  } catch (error: any) {
    mostrarMensaje(
        obtenerMensajeError(
            error,
            'No se pudo agregar la invitación.'
        ),
        'error'
    )
  } finally {
    agregandoInvitacion.value = false
  }
}

const guardarNombresSillas = async (
    invitacion: InvitacionMesa
) => {
  if (!mesaSeleccionada.value) {
    return
  }

  guardandoSillasInvitacionId.value =
      invitacion.id

  try {
    const respuesta = await $fetch<any>(
        `/api/admin/mesas/${mesaSeleccionada.value.id}/actualizar-sillas`,
        {
          method: 'PUT',
          body: {
            sillas: invitacion.sillas.map(
                (silla) => ({
                  id: silla.id,
                  nombre: silla.nombre
                })
            )
          }
        }
    )

    await cargarDetalleMesa()

    mostrarMensaje(
        respuesta?.message ||
        'Nombres actualizados correctamente.'
    )
  } catch (error: any) {
    mostrarMensaje(
        obtenerMensajeError(
            error,
            'No se pudieron guardar los nombres.'
        ),
        'error'
    )
  } finally {
    guardandoSillasInvitacionId.value =
        null
  }
}

const abrirMoverInvitacion = (
    invitacion: InvitacionMesa
) => {
  invitacionParaMover.value = invitacion
  mesaDestinoId.value = null
  dialogMoverInvitacion.value = true
}

const moverInvitacion = async () => {
  if (
      !mesaSeleccionada.value ||
      !invitacionParaMover.value ||
      !mesaDestinoId.value
  ) {
    return
  }

  moviendoInvitacion.value = true

  try {
    const respuesta = await $fetch<any>(
        `/api/admin/mesas/${mesaSeleccionada.value.id}/mover-invitacion`,
        {
          method: 'POST',
          body: {
            invitacion_id:
            invitacionParaMover.value.id,
            mesa_destino_id:
            mesaDestinoId.value
          }
        }
    )

    dialogMoverInvitacion.value = false

    await Promise.all([
      cargarDetalleMesa(),
      refreshMesas()
    ])

    invitacionParaMover.value = null
    mesaDestinoId.value = null

    mostrarMensaje(
        respuesta?.message ||
        'Invitación movida correctamente.'
    )
  } catch (error: any) {
    mostrarMensaje(
        obtenerMensajeError(
            error,
            'No se pudo mover la invitación.'
        ),
        'error'
    )
  } finally {
    moviendoInvitacion.value = false
  }
}

const confirmarQuitarInvitacion = (
    invitacion: InvitacionMesa
) => {
  invitacionParaQuitar.value = invitacion
  dialogQuitarInvitacion.value = true
}

const quitarInvitacion = async () => {
  if (
      !mesaSeleccionada.value ||
      !invitacionParaQuitar.value
  ) {
    return
  }

  quitandoInvitacion.value = true

  try {
    const respuesta = await $fetch<any>(
        `/api/admin/mesas/${mesaSeleccionada.value.id}/quitar-invitacion`,
        {
          method: 'DELETE',
          body: {
            invitacion_id:
            invitacionParaQuitar.value.id
          }
        }
    )

    dialogQuitarInvitacion.value = false

    await Promise.all([
      cargarDetalleMesa(),
      refreshMesas()
    ])

    invitacionParaQuitar.value = null

    mostrarMensaje(
        respuesta?.message ||
        'Invitación retirada correctamente.'
    )
  } catch (error: any) {
    mostrarMensaje(
        obtenerMensajeError(
            error,
            'No se pudo quitar la invitación.'
        ),
        'error'
    )
  } finally {
    quitandoInvitacion.value = false
  }
}

const actualizarMesa = async () => {
  if (!mesaSeleccionada.value) {
    return
  }

  if (
      formEditarMesa.capacidad <
      mesaSeleccionada.value.sillas_ocupadas
  ) {
    mostrarMensaje(
        'La capacidad no puede ser menor que los lugares ocupados.',
        'error'
    )

    return
  }

  actualizandoMesa.value = true

  try {
    const respuesta = await $fetch<any>(
        `/api/admin/mesas/${mesaSeleccionada.value.id}/update`,
        {
          method: 'PUT',
          body: {
            nombre: formEditarMesa.nombre,
            numero: formEditarMesa.numero,
            capacidad: formEditarMesa.capacidad
          }
        }
    )

    await Promise.all([
      cargarDetalleMesa(),
      refreshMesas()
    ])

    mostrarMensaje(
        respuesta?.message ||
        'Mesa actualizada correctamente.'
    )
  } catch (error: any) {
    mostrarMensaje(
        obtenerMensajeError(
            error,
            'No se pudo actualizar la mesa.'
        ),
        'error'
    )
  } finally {
    actualizandoMesa.value = false
  }
}
</script>

<style scoped>
.mesas-page {
  width: 100%;
  min-height: 100%;
  padding: 32px 28px 50px;
  box-sizing: border-box;
}

.page-head {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  margin-bottom: 32px;
}

.page-head-info {
  min-width: 0;
  flex: 1;
}

.section-kicker,
.dialog-kicker {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #9b7a55;
  font-size: 12px;
  font-weight: 700;
}

.page-head h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: clamp(38px, 5vw, 52px);
  line-height: 1.05;
  font-weight: 400;
  color: #2f2923;
}

.page-description {
  max-width: 620px;
  margin: 10px 0 0;
  color: #756c63;
  font-size: 15px;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0;
  padding-top: 6px;
}

.mesa-card {
  height: 100%;
  padding: 24px;
  border-radius: 26px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(199, 166, 125, 0.25);
  transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
}

.mesa-card:hover,
.mesa-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(155, 122, 85, 0.45);
  box-shadow: 0 18px 40px rgba(63, 48, 34, 0.1);
  outline: none;
}

.mesa-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mesa-icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #806442;
  background: rgba(199, 166, 125, 0.14);
}

.mesa-card h2 {
  margin: 18px 0 5px;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
  color: #2f2923;
}

.mesa-number {
  margin: 0;
  color: #83786e;
  font-size: 14px;
}

.mesa-progress {
  margin: 22px 0 18px;
}

.mesa-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.mesa-stats div,
.summary-item {
  padding: 12px 8px;
  text-align: center;
  border-radius: 15px;
  background: rgba(248, 246, 242, 0.9);
}

.mesa-stats span,
.summary-item span {
  display: block;
  color: #857970;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.mesa-stats strong,
.summary-item strong {
  display: block;
  margin-top: 3px;
  color: #332c26;
  font-size: 20px;
}

.open-button {
  margin-top: 18px;
}

.form-card {
  padding: 28px;
  background: #fffdfb;
}

.dialog-title-row,
.mesa-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.dialog-title-row {
  margin-bottom: 24px;
}

.dialog-title-row h2,
.mesa-dialog-header h2,
.confirm-title {
  margin: 0;
  font-family: Georgia, serif;
  color: #2f2923;
  font-size: 30px;
  font-weight: 400;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.mesa-dialog {
  max-height: 92vh;
  background: #fffdfb;
}

.mesa-dialog-header {
  padding: 24px 28px 18px;
}

.dialog-subtitle {
  margin: 6px 0 0;
  color: #7e746b;
}

.mesa-dialog-content {
  padding: 28px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.detail-progress {
  margin: 16px 0 26px;
}

.section-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.section-toolbar h3,
.edit-heading h3 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
  color: #312b26;
}

.section-toolbar p,
.edit-heading p {
  margin: 5px 0 0;
  color: #7c7269;
}

.guest-list {
  display: grid;
  gap: 16px;
}

.guest-card {
  padding: 20px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(199, 166, 125, 0.26);
}

.guest-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.guest-main-info {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.guest-avatar {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 15px;
  color: #876b49;
  background: rgba(199, 166, 125, 0.15);
}

.guest-main-info h4,
.available-info h4 {
  margin: 0;
  color: #332c26;
  font-size: 17px;
}

.guest-main-info p,
.available-info p {
  margin: 4px 0 0;
  color: #81766d;
  font-size: 13px;
}

.chair-names {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.chair-title {
  grid-column: 1 / -1;
  margin: 0;
  color: #665d55;
  font-size: 13px;
  font-weight: 700;
}

.guest-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 18px;
}

.empty-guests,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #82766c;
}

.empty-guests {
  min-height: 260px;
  padding: 30px;
}

.empty-state {
  min-height: 420px;
}

.empty-guests h3,
.empty-state h2 {
  margin: 15px 0 5px;
  color: #3b332c;
  font-family: Georgia, serif;
  font-weight: 400;
}

.empty-guests p,
.empty-state p {
  max-width: 480px;
  margin: 0 0 20px;
}

.edit-section {
  max-width: 700px;
  margin: 0 auto;
}

.edit-heading {
  margin-bottom: 24px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
}

.available-list {
  display: grid;
  gap: 10px;
  max-height: 440px;
  overflow-y: auto;
}

.available-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 18px;
  cursor: pointer;
  border: 1px solid rgba(199, 166, 125, 0.23);
  transition: background 0.2s ease;
}

.available-card:hover {
  background: rgba(199, 166, 125, 0.08);
}

.available-info {
  flex: 1;
  min-width: 0;
}

.available-info span {
  display: block;
  margin-top: 6px;
  color: #675e56;
  font-size: 13px;
}

.loading-container {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #776d65;
}

.confirm-icon {
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  border-radius: 22px;
}

.error-icon {
  color: rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.1);
}

.confirm-title,
.confirm-text {
  text-align: center;
}

.confirm-text {
  margin: 8px 0;
  color: #726860;
}

@media (max-width: 959px) {
  .mesas-page {
    padding: 24px 20px 40px;
  }

  .page-head {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    padding-top: 0;
  }

  .mesa-dialog {
    max-height: none;
    border-radius: 0 !important;
  }
}

@media (max-width: 600px) {
  .mesas-page {
    padding: 20px 14px 35px;
  }

  .page-head {
    margin-bottom: 22px;
  }

  .page-head h1 {
    font-size: 40px;
  }

  .header-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .header-actions :deep(.v-btn) {
    width: 100%;
  }

  .mesa-card {
    padding: 20px;
  }

  .form-card {
    padding: 22px 18px;
  }

  .mesa-dialog-header {
    padding: 20px 18px 14px;
  }

  .mesa-dialog-content {
    padding: 20px 16px;
  }

  .summary-grid {
    gap: 7px;
  }

  .summary-item {
    padding: 10px 4px;
  }

  .summary-item span {
    font-size: 9px;
  }

  .summary-item strong {
    font-size: 18px;
  }

  .section-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .section-toolbar :deep(.v-btn) {
    width: 100%;
  }

  .guest-card {
    padding: 16px;
  }

  .guest-card-header {
    align-items: flex-start;
  }

  .chair-names {
    grid-template-columns: 1fr;
  }

  .guest-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .guest-actions :deep(.v-btn) {
    width: 100%;
  }

  .available-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .available-card :deep(.v-chip) {
    margin-left: 48px;
  }

  .dialog-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .dialog-actions :deep(.v-btn) {
    width: 100%;
  }
}
</style>
