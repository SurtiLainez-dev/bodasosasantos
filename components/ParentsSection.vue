<template>
  <section class="parents-section">
    <div class="parents-container">


      <p class="parents-intro">
        Bendecidos por Dios y rodeados del amor de nuestros padres
      </p>

      <v-card class="parent-card" elevation="0">
        <div class="parent-block">
          <p class="parent-title">Padres de la novia</p>

          <p class="parent-name">
            Francisco Esteban Sosa Martinez <span class="cross">†</span>
          </p>
          <p class="parent-name">Elsy Beatriz Mejia Fuentes</p>
        </div>

        <div class="divider"></div>

        <div class="parent-block">
          <p class="parent-title">Padres del novio</p>

          <p class="parent-name">Oscar Omar Santos</p>
          <p class="parent-name">Josefina Lainez Sandoval</p>
        </div>
      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.parents-section {
  background: #f8f8f6;
  padding: 100px 24px;
}

.parents-container {
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
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 16px;
}

.parents-intro {
  max-width: 560px;
  margin: 0 auto 34px;
  font-size: 16px;
  line-height: 1.8;
  color: #236daf;
  letter-spacing: 2.5px;
  text-transform: uppercase;
}

.parent-card {
  padding: 48px 34px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(157, 199, 236, 0.55);
  box-shadow: 0 20px 60px rgba(12, 37, 60, 0.10);
}

.parent-block {
  display: grid;
  gap: 10px;
}

.parent-title {
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 12px;
  color: #2984d1;
  margin-bottom: 14px;
}

.parent-name {
  font-size: clamp(15px, 3vw, 31px);
  font-weight: 500;
  color: #0c253c;
  margin: 0;
  line-height: 1.35;
}

.cross {
  font-size: 22px;
  color: #000000;
  vertical-align: super;
  margin-left: 1px;
}

.divider {
  width: 90px;
  height: 1px;
  background: #9dc7ec;
  margin: 36px auto;
}

@media (max-width: 768px) {
  .parents-section {
    padding: 80px 18px;
  }

  .parent-card {
    padding: 38px 22px;
    border-radius: 28px;
  }

  .parents-intro {
    font-size: 13px;
    letter-spacing: 2px;
  }

  .parent-title {
    letter-spacing: 3px;
  }
}
</style>
