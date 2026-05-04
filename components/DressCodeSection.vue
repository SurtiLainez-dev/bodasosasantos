<template>
  <section class="dress-section">
    <div class="dress-container">
      <p class="section-kicker">Código de vestimenta</p>

      <v-card class="dress-card" elevation="0">

        <!-- ICONO PRINCIPAL -->
        <div class="dress-icon">
          <v-icon size="36">mdi-human-male-female</v-icon>
        </div>

        <!-- TIPO -->
        <p class="dress-type">
          Formal / Semi formal
        </p>

        <!-- MENSAJE -->
        <p class="dress-text">
          Puedes optar por un estilo formal o semi formal que te haga sentir cómodo/a y acorde al ambiente.
        </p>

        <!-- REGLA -->
        <div class="dress-warning">
          <v-icon size="18">mdi-alert-circle-outline</v-icon>
          <span>Evitar vestir de blanco</span>
        </div>

      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.dress-section {
  background: #EAF3FB;
  padding: 100px 24px;
}

.dress-container {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

/* TITULO */
.section-kicker {
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #2984D1;
  font-size: 13px;
  margin-bottom: 20px;
}

/* CARD */
.dress-card {
  padding: 60px 40px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #9DC7EC;
  box-shadow: 0 20px 60px rgba(12, 37, 60, 0.10);
}

/* ICONO */
.dress-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 24px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #F8F8F6;
  color: #2984D1;
  border: 1px solid #9DC7EC;
}

/* TIPO */
.dress-type {
  font-size: 22px;
  font-weight: 600;
  color: #0C253C;
  margin-bottom: 14px;
}

/* TEXTO */
.dress-text {
  font-size: 17px;
  line-height: 1.8;
  color: #133D62;
  margin-bottom: 26px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* WARNING */
.dress-warning {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 18px;
  border-radius: 999px;

  background: #F8F8F6;
  color: #0C253C;
  border: 1px solid #C3DDF3;
  font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .dress-card {
    padding: 40px 24px;
  }

  .dress-type {
    font-size: 20px;
  }

  .dress-text {
    font-size: 15px;
  }
}
</style>
