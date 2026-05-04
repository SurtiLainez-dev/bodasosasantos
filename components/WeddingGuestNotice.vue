<template>
  <div>
    <button class="guest-notice" @click="dialog = true">
      {{ message }}
    </button>

    <v-dialog v-model="dialog" max-width="420">
      <v-card class="notice-card">
        <div class="seal">AW</div>

        <h2>Información de contacto</h2>

        <p>
          Puedes comunicarte con Andrea y Williams por este medio.
        </p>

        <a href="mailto:bodasosasantos@gmail.com">
          bodasosasantos@gmail.com
        </a>

        <v-btn
            block
            color="primary"
            rounded="xl"
            class="mt-6"
            @click="dialog = false"
        >
          Entendido
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

const dialog = ref(false)
</script>

<style scoped>
.guest-notice {
  position: fixed;
  top: 94px;
  right: 24px;
  z-index: 9998;

  border: 1px solid rgba(199, 166, 125, 0.35);
  background: rgba(255, 248, 241, 0.92);
  color: #8a643d;
  border-radius: 999px;
  padding: 12px 20px;
  box-shadow: 0 16px 45px rgba(80, 58, 40, 0.14);
  cursor: pointer;
}

.notice-card {
  padding: 34px;
  border-radius: 30px;
  text-align: center;
  background: #fff8f1;
}

.seal {
  width: 66px;
  height: 66px;
  margin: 0 auto 20px;
  border-radius: 50%;
  border: 1px solid #d7b98a;
  color: #8a643d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Brush Script MT", "Segoe Script", cursive;
  font-size: 30px;
}

h2 {
  font-family: Georgia, serif;
  font-weight: 400;
  color: #2f2923;
}

p {
  color: #5b5048;
  line-height: 1.7;
}

a {
  color: #8a643d;
  font-weight: 600;
}
</style>
