<template>
  <div class="login-page">
    <div class="login-overlay"></div>

    <v-card class="login-card" elevation="0">
      <div class="seal">AW</div>

      <p class="login-kicker">Panel del evento</p>

      <h1>Bienvenido</h1>

      <p class="login-text">
        Ingresa para administrar las invitaciones y confirmaciones.
      </p>

      <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-form @submit.prevent="login">
        <v-text-field
            v-model="form.usuario"
            label="Usuario"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
        />

        <v-text-field
            v-model="form.password"
            label="Contraseña"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPassword = !showPassword"
        />

        <v-btn
            type="submit"
            block
            size="large"
            color="primary"
            rounded="xl"
            :loading="loading"
            class="login-btn"
        >
          Iniciar sesión
        </v-btn>
      </v-form>

      <small class="login-footer">
        Andrea & Williams · Administración
      </small>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const form = reactive({
  usuario: '',
  password: ''
})

const login = async () => {
  if (loading.value) return

  errorMessage.value = ''
  loading.value = true

  let res: any = null

  try {
    res = await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        usuario: form.usuario,
        password: form.password
      }
    })
  } catch (error: any) {
    errorMessage.value =
        error?.data?.statusMessage ||
        error?.statusMessage ||
        'Usuario o contraseña incorrectos'

    loading.value = false
    return
  }

  if (!res?.ok) {
    errorMessage.value = 'Usuario o contraseña incorrectos'
    loading.value = false
    return
  }

  errorMessage.value = ''
  loading.value = false

  await navigateTo('/admin/evento')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-image: url('/images/portada4.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      to right,
      rgba(255, 248, 241, 0.88),
      rgba(255, 248, 241, 0.60)
  );
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 46px 38px;
  border-radius: 34px;
  text-align: center;

  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(199, 166, 125, 0.35);
  box-shadow: 0 24px 70px rgba(80, 58, 40, 0.14);
}

.seal {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  margin: 0 auto 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Brush Script MT", "Segoe Script", cursive;
  font-size: 34px;
  color: #8a643d;

  background: #fff7ee;
  border: 1px solid #d7b98a;
}

.login-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #9b7a55;
  font-size: 13px;
  margin-bottom: 12px;
}

h1 {
  font-family: Georgia, serif;
  font-size: 46px;
  font-weight: 400;
  color: #2f2923;
  margin-bottom: 14px;
}

.login-text {
  color: #5b5048;
  line-height: 1.7;
  margin-bottom: 28px;
}

.login-btn {
  text-transform: none;
  margin-top: 8px;
}

.login-footer {
  display: block;
  margin-top: 28px;
  color: #8a7a6b;
}

@media (max-width: 560px) {
  .login-card {
    padding: 36px 24px;
    border-radius: 28px;
  }

  h1 {
    font-size: 38px;
  }
}
</style>
