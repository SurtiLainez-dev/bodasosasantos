<template>
  <section id="asistencia" class="rsvp-section">
    <div class="rsvp-container">
      <p class="section-kicker">Confirma tu asistencia</p>
      <h2>¿Nos acompañas?</h2>

      <v-card class="rsvp-card" elevation="0">
        <!-- PASO 1 -->
        <div v-if="step === 1" class="rsvp-content">
          <div class="icon-circle">
            <v-icon size="30">mdi-ticket-confirmation-outline</v-icon>
          </div>

          <h3>Código de reserva</h3>

          <p class="deadline-message">
            Esperamos tu confirmación antes del <strong>30 de junio</strong>.
          </p>

          <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-5 text-left"
          >
            {{ errorMessage }}
          </v-alert>

          <v-text-field
              v-model="reservationCode"
              label="Ingresa tu código de 9 dígitos"
              variant="outlined"
              maxlength="9"
              counter="9"
              class="mt-6"
              @input="reservationCode = reservationCode.replace(/\D/g, '').slice(0, 9)"
          />

          <v-btn
              block
              size="large"
              color="primary"
              rounded="xl"
              class="mt-2"
              :loading="loadingCheck"
              :disabled="reservationCode.length !== 9"
              @click="checkReservation"
          >
            Comprobar invitación
          </v-btn>
        </div>

        <!-- PASO 2 -->
        <div v-else class="rsvp-content">
          <div class="guest-avatar-wrap">
            <v-avatar size="86" class="guest-avatar">
              <v-img
                  v-if="guest.foto"
                  :src="guest.foto"
                  cover
              />
              <span v-else>{{ guest.iniciales }}</span>
            </v-avatar>
          </div>

          <h3>Hola, {{ guest.nombre }}</h3>

          <p class="guest-info">
            Tu invitación está reservada para
            <strong>{{ guest.cantidad_permitida }}</strong>
            {{ guest.cantidad_permitida === 1 ? 'persona' : 'personas' }}.
          </p>

          <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-5 mb-5 text-left"
          >
            {{ errorMessage }}
          </v-alert>

          <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mt-5 mb-5 text-left"
          >
            {{ successMessage }}
          </v-alert>

          <v-select
              v-model="form.respuesta"
              label="¿Asistirás?"
              :items="attendanceOptions"
              variant="outlined"
              class="mt-6"
          />

          <template v-if="form.respuesta === 'SI'">
            <v-text-field
                v-model="form.telefono"
                label="Número de teléfono"
                variant="outlined"
            />

            <v-text-field
                v-model.number="form.cantidad_asistira"
                label="Cantidad de personas que asistirán"
                type="number"
                variant="outlined"
                :max="guest.cantidad_permitida"
                min="1"
            />
          </template>

          <v-btn
              block
              size="large"
              color="primary"
              rounded="xl"
              class="mt-2"
              :loading="loadingSend"
              :disabled="!form.respuesta || !!successMessage"
              @click="sendConfirmation"
          >
            Enviar confirmación
          </v-btn>

          <v-btn
              variant="text"
              class="mt-3 back-btn"
              :disabled="loadingSend"
              @click="resetForm"
          >
            Cambiar código
          </v-btn>
        </div>
      </v-card>

      <div class="help-box" v-if="props.showWhatsapp">
        <p>¿Necesitas ayuda con tu confirmación?</p>

        <v-btn
            href="https://wa.me/13464619433"
            target="_blank"
            rounded="xl"
            color="success"
            size="large"
            class="whatsapp-btn"
        >
          <v-icon start>mdi-whatsapp</v-icon>
          Escribir por WhatsApp
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps<{
  showWhatsapp?: boolean
}>()

const route = useRoute()

const step = ref(1)
const reservationCode = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loadingCheck = ref(false)
const loadingSend = ref(false)

const guest = reactive({
  id: null as number | null,
  nombre: '',
  foto: '',
  cantidad_permitida: 1,
  cod_reserva: '',
  iniciales: ''
})

const attendanceOptions = [
  { title: 'Sí asistiré', value: 'SI' },
  { title: 'No podré asistir', value: 'NO' }
]

const form = reactive({
  respuesta: '',
  telefono: '',
  cantidad_asistira: 1
})

const checkReservation = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loadingCheck.value = true

  try {
    const token = String(route.query.token || '')

    const res: any = await $fetch('/api/invitacion/validar-reserva', {
      method: 'POST',
      body: {
        token,
        cod_reserva: reservationCode.value
      }
    })

    guest.id = res.invitado.id
    guest.nombre = res.invitado.nombre
    guest.foto = res.invitado.foto || ''
    guest.cantidad_permitida = Number(res.invitado.cantidad_permitida || 1)
    guest.cod_reserva = res.invitado.cod_reserva
    guest.iniciales = res.invitado.iniciales || 'IN'

    form.respuesta = ''
    form.telefono = ''
    form.cantidad_asistira = 1

    step.value = 2
  } catch (error: any) {
    errorMessage.value =
        error?.data?.statusMessage ||
        error?.statusMessage ||
        'No pudimos validar tu invitación.'
  } finally {
    loadingCheck.value = false
  }
}

const sendConfirmation = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.respuesta) {
    errorMessage.value = 'Selecciona si asistirás o no.'
    return
  }

  if (form.respuesta === 'SI') {
    if (!form.telefono.trim()) {
      errorMessage.value = 'Ingresa tu número de teléfono.'
      return
    }

    const cantidad = Number(form.cantidad_asistira)

    if (!cantidad || cantidad <= 0) {
      errorMessage.value = 'La cantidad de asistentes debe ser mayor a 0.'
      return
    }

    if (cantidad > guest.cantidad_permitida) {
      errorMessage.value = `Tu invitación permite máximo ${guest.cantidad_permitida} ${guest.cantidad_permitida === 1 ? 'persona' : 'personas'}.`
      return
    }
  }

  loadingSend.value = true

  try {
    const token = String(route.query.token || '')

    await $fetch('/api/invitacion/confirmar', {
      method: 'POST',
      body: {
        token,
        cod_reserva: reservationCode.value,
        respuesta: form.respuesta,
        telefono: form.respuesta === 'SI' ? form.telefono : '',
        cantidad_asistira: form.respuesta === 'SI' ? Number(form.cantidad_asistira) : 0
      }
    })

    successMessage.value = 'Gracias, tu respuesta fue registrada correctamente.'
  } catch (error: any) {
    errorMessage.value =
        error?.data?.statusMessage ||
        error?.statusMessage ||
        'No pudimos guardar tu confirmación.'
  } finally {
    loadingSend.value = false
  }
}

const resetForm = () => {
  step.value = 1
  reservationCode.value = ''
  errorMessage.value = ''
  successMessage.value = ''

  guest.id = null
  guest.nombre = ''
  guest.foto = ''
  guest.cantidad_permitida = 1
  guest.cod_reserva = ''
  guest.iniciales = ''

  form.respuesta = ''
  form.telefono = ''
  form.cantidad_asistira = 1
}
</script>

<style scoped>
.rsvp-section {
  background: #eaf3fb;
  padding: 100px 24px;
}

.rsvp-container {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.section-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #2984d1;
  font-size: 13px;
  margin-bottom: 14px;
}

h2 {
  font-family: Georgia, serif;
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 36px;
}

.rsvp-card {
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(157, 199, 236, 0.6);
  box-shadow: 0 24px 70px rgba(12, 37, 60, 0.12);
  overflow: hidden;
}

.rsvp-content {
  padding: 56px 46px;
}

.icon-circle,
.guest-avatar {
  width: 70px;
  height: 70px;
  margin: 0 auto 24px;
  border-radius: 999px;
  background: #f8f8f6;
  color: #2984d1;
  border: 1px solid #9dc7ec;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guest-avatar-wrap {
  display: flex;
  justify-content: center;
}

.guest-avatar {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
}

h3 {
  font-family: Georgia, serif;
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 22px;
}

.deadline-message,
.guest-info {
  max-width: 560px;
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.8;
  color: #133d62;
}

.deadline-message strong,
.guest-info strong {
  color: #2984d1;
}

.back-btn {
  color: #236daf;
  text-transform: none;
}

.help-box {
  margin-top: 34px;
  padding: 28px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(157, 199, 236, 0.45);
  box-shadow: 0 16px 40px rgba(12, 37, 60, 0.08);
}

.help-box p {
  font-size: 17px;
  color: #133d62;
  margin-bottom: 16px;
}

.whatsapp-btn {
  text-transform: none;
}

@media (max-width: 768px) {
  .rsvp-section {
    padding: 80px 18px;
  }

  .rsvp-content {
    padding: 40px 24px;
  }
}
</style>
