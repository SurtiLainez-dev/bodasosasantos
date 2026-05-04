<template>
  <div>
    <div class="page-head">
      <div>
        <p class="section-kicker">Administración</p>
        <h1>Invitados</h1>
      </div>

      <v-btn color="primary" rounded="xl" @click="dialog = true">
        <v-icon start>mdi-plus</v-icon>
        Nuevo invitado
      </v-btn>
    </div>

    <v-card class="table-card" elevation="0">
      <v-data-table
          :headers="headers"
          :items="invitados"
          item-value="id"
      >
        <template #item.respuesta="{ item }">
          <v-chip
              size="small"
              :color="item.respuesta === 'SI' ? 'success' : item.respuesta === 'NO' ? 'error' : 'warning'"
          >
            {{ item.respuesta_recibida ? item.respuesta : 'Pendiente' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
              size="small"
              color="primary"
              variant="tonal"
              rounded="xl"
              @click="openDetails(item)"
          >
            <v-icon start>mdi-eye-outline</v-icon>
            Ver
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- MODAL DETALLE -->
    <v-dialog v-model="detailsDialog" max-width="900">
      <v-card v-if="selectedGuest" class="details-card" elevation="0">
        <div class="details-header">
          <div>
            <p class="section-kicker">Detalle de invitación</p>
            <h2>{{ selectedGuest.nombre }}</h2>
          </div>

          <v-chip
              :color="selectedGuest.respuesta_recibida ? 'success' : 'warning'"
              variant="tonal"
          >
            {{ selectedGuest.respuesta_recibida ? 'Respondida' : 'Sin respuesta' }}
          </v-chip>
        </div>

        <v-divider class="my-5" />

        <div class="details-grid">
          <div class="detail-item">
            <span>Tipo</span>
            <strong>{{ selectedGuest.tipo || '-' }}</strong>
          </div>

          <div class="detail-item">
            <span>Código reserva</span>
            <strong>{{ selectedGuest.cod_reserva || '-' }}</strong>
          </div>

          <div class="detail-item">
            <span>Permitidos</span>
            <strong>{{ selectedGuest.cantidad_permitida || 0 }}</strong>
          </div>

          <div class="detail-item">
            <span>Confirmados</span>
            <strong>{{ selectedGuest.cantidad_confirmados || 0 }}</strong>
          </div>

          <div class="detail-item">
            <span>Respuesta</span>
            <strong>{{ selectedGuest.respuesta || 'Pendiente' }}</strong>
          </div>

          <div class="detail-item">
            <span>Teléfono</span>
            <strong>{{ selectedGuest.telefono || '-' }}</strong>
          </div>

          <div class="detail-item">
            <span>Fecha vencimiento</span>
            <strong>{{ formatDate(selectedGuest.fecha_vencimiento) }}</strong>
          </div>

          <div class="detail-item">
            <span>Fecha respuesta</span>
            <strong>{{ formatDate(selectedGuest.fecha_respuesta) }}</strong>
          </div>

          <div class="detail-item">
            <span>Caducada</span>
            <strong>{{ selectedGuest.caducada ? 'Sí' : 'No' }}</strong>
          </div>

          <div class="detail-item">
            <span>IP respuesta</span>
            <strong>{{ selectedGuest.ip_respuesta || '-' }}</strong>
          </div>
        </div>

        <div class="detail-full mt-5">
          <span>Link de invitación</span>
          <div class="link-box">
            {{ invitationLink(selectedGuest) }}
          </div>
        </div>

        <div class="detail-full mt-4">
          <span>Token</span>
          <div class="token-box">
            {{ selectedGuest.token_acceso }}
          </div>
        </div>

        <div class="detail-full mt-4">
          <span>Comentario</span>
          <div class="comment-box">
            {{ selectedGuest.comentario || 'Sin comentario' }}
          </div>
        </div>

        <div class="modal-actions">
          <v-btn color="primary" rounded="xl" @click="descargarQR(selectedGuest)">
            <v-icon start>mdi-qrcode</v-icon>
            Descargar QR
          </v-btn>

          <v-btn color="secondary" rounded="xl" @click="descargarInvitacionDigital(selectedGuest)">
            <v-icon start>mdi-download</v-icon>
            Descargar HTML
          </v-btn>

          <v-btn color="secondary" variant="outlined" rounded="xl" @click="descargarInvitacionImagen(selectedGuest)">
            <v-icon start>mdi-image</v-icon>
            Descargar foto
          </v-btn>

          <v-spacer />

          <v-btn variant="text" @click="detailsDialog = false">
            Cerrar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- MODAL NUEVO -->
    <v-dialog v-model="dialog" max-width="520">
      <v-card class="form-card">
        <h2>Nuevo invitado</h2>

        <v-select
            v-model="form.tipo"
            :items="['novio', 'novia']"
            label="Tipo"
            variant="outlined"
        />

        <v-text-field
            v-model="form.nombre"
            label="Nombre"
            variant="outlined"
        />

        <v-text-field
            v-model.number="form.cantidad_permitida"
            label="Cantidad permitida"
            type="number"
            variant="outlined"
        />

        <v-textarea
            v-model="form.comentario"
            label="Comentario"
            variant="outlined"
        />

        <v-btn block color="primary" rounded="xl" @click="crearInvitado">
          Guardar invitado
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Permitidos', key: 'cantidad_permitida' },
  { title: 'Código', key: 'cod_reserva' },
  { title: 'Respuesta', key: 'respuesta' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const dialog = ref(false)
const detailsDialog = ref(false)
const selectedGuest = ref<any>(null)

const form = reactive({
  tipo: 'novio',
  nombre: '',
  cantidad_permitida: 1,
  comentario: ''
})

const { data, refresh } = await useFetch('/api/admin/invitados')

const invitados = computed(() => data.value?.invitados || [])

const openDetails = (item: any) => {
  selectedGuest.value = item
  detailsDialog.value = true
}

const invitationLink = (item: any) => {
  return `http://localhost:3000/?token=${item.token_acceso}`
}

const formatDate = (date: any) => {
  if (!date) return '-'

  return new Date(date).toLocaleString('es-HN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const descargarQR = async (item: any) => {
  const res: any = await $fetch(`/api/admin/invitados/${item.id}/qr`)

  const a = document.createElement('a')
  a.href = res.qr
  a.download = `QR-${item.nombre}.png`
  a.click()
}

const descargarInvitacionImagen = async (item: any) => {
  const res: any = await $fetch(`/api/admin/invitados/${item.id}/qr`)

  const container = document.createElement('div')

  container.style.position = 'fixed'
  container.style.left = '-99999px'
  container.style.top = '0'
  container.style.width = '1080px'
  container.style.height = '1080px'
  container.style.background = '#f4f3f1'
  container.style.display = 'flex'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'

  container.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">

    <div style="
      width: 780px;
      height: 900px;
      padding: 54px 44px 42px;
      background: #f7f4ee; /* 🔥 SOLO COLOR LIMPIO */
      border: 4px solid #9DC7EC;
      text-align: center;
      box-shadow: 0 24px 70px rgba(0,0,0,0.12);
      font-family: 'Cormorant Garamond', Georgia, serif;
      color: #111;
    ">
      <h1 style="
        font-family: 'Monsieur La Doulaise', cursive;
        font-size: 92px;
        font-weight: 400;
        margin: 8px 0 36px;
        line-height: 0.95;
      ">
        Williams & Andrea
      </h1>

      <div style="
        font-size: 26px;
        color: #555;
        margin-bottom: 10px;
        font-weight: 500;
      ">
        Para:
      </div>

      <div style="
        font-size: 42px;
        font-weight: 600;
        letter-spacing: 6px;
        text-transform: uppercase;
        margin-bottom: 30px;
        line-height: 1.15;
      ">
        ${item.nombre}
      </div>

      <div style="
        width: 150px;
        height: 1px;
        background: #bdbdbd;
        margin: 0 auto 30px;
      "></div>

      <p style="
        max-width: 560px;
        margin: 0 auto 34px;
        font-size: 30px;
        line-height: 1.35;
        color: #333;
      ">
        Escanea el código QR para ver tu invitación digital.
      </p>

      <div style="
        width: 320px;
        height: 320px;
        margin: 0 auto 34px;
        padding: 20px;
        background: #ffffff; /* 🔥 limpio */
        border: 1px solid rgba(0,0,0,0.12);
        border-radius: 26px;
      ">
        <img src="${res.qr}" style="
          width: 100%;
          height: 100%;
          display: block;
        " />
      </div>

      <div style="
        font-family: Arial, sans-serif;
        font-size: 16px;
        letter-spacing: 3px;
        color: #555;
        text-transform: uppercase;
      ">
        Código de reserva:
        <strong style="
          color:#111;
          letter-spacing: 3px;
        ">
          ${item.cod_reserva}
        </strong>
      </div>
    </div>
  `

  document.body.appendChild(container)

  await document.fonts.ready
  await new Promise(resolve => setTimeout(resolve, 500))

  const canvas = await html2canvas(container, {
    scale: 2,
    backgroundColor: '#f4f3f1',
    useCORS: true
  })

  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = `Invitacion-${item.nombre}.png`
  a.click()

  document.body.removeChild(container)
}

const descargarInvitacionDigital = async (item: any) => {
  const res: any = await $fetch(`/api/admin/invitados/${item.id}/qr`)

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitación ${item.nombre}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: #f4f3f1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: "Cormorant Garamond", Georgia, serif;
      color: #111;
    }

    .invite {
      width: 100%;
      max-width: 620px;
      padding: 34px;
      background:
        radial-gradient(circle at 18% 12%, rgba(255,255,255,0.92), transparent 28%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.65), transparent 30%),
        repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0.28) 0px,
          rgba(255,255,255,0.28) 1px,
          rgba(242,239,233,0.32) 2px,
          rgba(242,239,233,0.32) 4px
        ),
        #f7f4ee;
      border: 3px solid #9DC7EC;
      text-align: center;
      box-shadow: 0 24px 70px rgba(0,0,0,0.12);
    }

    .names {
      font-family: "Monsieur La Doulaise", cursive;
      font-size: 76px;
      font-weight: 400;
      margin: 8px 0 32px;
      line-height: 0.95;
      color: #111;
    }

    .to {
      font-size: 22px;
      color: #555;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .guest {
      font-size: 34px;
      font-weight: 600;
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-bottom: 26px;
      line-height: 1.15;
      color: #111;
    }

    .line {
      width: 140px;
      height: 1px;
      background: #bdbdbd;
      margin: 0 auto 28px;
    }

    .message {
      max-width: 480px;
      margin: 0 auto 28px;
      font-size: 25px;
      line-height: 1.35;
      color: #333;
    }

    .qr-wrap {
      width: 275px;
      height: 275px;
      margin: 0 auto 28px;
      padding: 18px;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(0,0,0,0.12);
      border-radius: 24px;
      box-shadow: inset 0 0 18px rgba(0,0,0,0.04);
    }

    .qr {
      width: 100%;
      height: 100%;
      display: block;
    }

    .button {
      display: inline-block;
      background: #111;
      color: #fff;
      text-decoration: none;
      padding: 15px 30px;
      border-radius: 999px;
      font-family: Arial, sans-serif;
      font-weight: 700;
      font-size: 15px;
      box-shadow: 0 12px 28px rgba(0,0,0,0.18);
    }

    .code {
      margin-top: 22px;
      font-family: Arial, sans-serif;
      font-size: 13px;
      letter-spacing: 2px;
      color: #555;
      text-transform: uppercase;
    }

    .code strong {
      color: #111;
    }

    @media (max-width: 520px) {
      .invite { padding: 28px 20px; }
      .names { font-size: 56px; }
      .guest { font-size: 25px; letter-spacing: 3px; }
      .message { font-size: 21px; }
      .qr-wrap { width: 230px; height: 230px; }
    }
  </style>
</head>

<body>
  <main class="invite">
    <h1 class="names">Williams & Andrea</h1>

    <div class="to">Para:</div>
    <div class="guest">${item.nombre}</div>

    <div class="line"></div>

    <p class="message">
      Escanea el código QR o presiona el botón para ver tu invitación digital.
    </p>

    <div class="qr-wrap">
      <img class="qr" src="${res.qr}" alt="Código QR" />
    </div>

    <a class="button" href="${res.url}" target="_blank">
      Presiona aquí para ver la invitación
    </a>

    <div class="code">
      Código de reserva: <strong>${item.cod_reserva}</strong>
    </div>
  </main>
</body>
</html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `Invitacion-${item.nombre}.html`
  a.click()

  URL.revokeObjectURL(url)
}

const crearInvitado = async () => {
  await $fetch('/api/admin/invitados/create', {
    method: 'POST',
    body: form
  })

  dialog.value = false
  form.nombre = ''
  form.cantidad_permitida = 1
  form.comentario = ''

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
  color: #2984d1;
  font-size: 13px;
}

h1 {
  font-family: Georgia, serif;
  font-size: 48px;
  font-weight: 400;
  color: #0c253c;
}

.table-card,
.form-card,
.details-card {
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(157, 199, 236, 0.55);
}

.form-card,
.details-card {
  padding: 30px;
}

.form-card h2,
.details-card h2 {
  font-family: Georgia, serif;
  font-weight: 400;
  color: #0c253c;
}

.details-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.detail-item,
.detail-full {
  padding: 14px 16px;
  border-radius: 18px;
  background: #f8f8f6;
  border: 1px solid rgba(157, 199, 236, 0.35);
}

.detail-item span,
.detail-full span {
  display: block;
  color: #236daf;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  margin-bottom: 5px;
}

.detail-item strong {
  color: #0c253c;
  font-weight: 600;
}

.link-box,
.token-box,
.comment-box {
  color: #0c253c;
  word-break: break-all;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 26px;
}

@media (max-width: 768px) {
  .page-head,
  .details-header {
    flex-direction: column;
    align-items: stretch;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 38px;
  }
}
</style>
