<template>
  <section id="recepcion" class="reception-section">
    <div class="reception-container">
      <p class="section-kicker">Recepción</p>

      <v-card class="reception-card" elevation="0">

        <!-- CONTENIDO CENTRAL -->
        <div class="reception-info">

          <div class="icon-circle">
            <v-icon size="28">mdi-glass-cocktail</v-icon>
          </div>

          <h3>Área verde del D’Antoni Golf Club</h3>

          <div class="info-row">
            <v-icon size="22">mdi-map-marker</v-icon>
            <span>La Ceiba, Atlántida</span>
          </div>

          <div class="info-row">
            <v-icon size="22">mdi-clock-outline</v-icon>
            <span>6:00 PM</span>
          </div>

          <p class="reception-text">
            Después de la ceremonia religiosa, celebraremos una noche llena de alegria, amor y buenos recuerdos.
          </p>

          <v-btn
              href="https://www.google.com/maps/search/?api=1&query=La%20Ceiba%20D%27Antoni%20Golf%20Club%20La%20Ceiba%20Honduras"
              target="_blank"
              color="primary"
              rounded="xl"
              size="large"
              class="map-btn"
          >
            <v-icon start>mdi-map-search</v-icon>
            Abrir en Google Maps
          </v-btn>

        </div>

        <!-- MAPA -->
        <div class="map-wrap">
          <iframe
              src="https://www.google.com/maps?q=La%20Ceiba%20D%27Antoni%20Golf%20Club%20La%20Ceiba%20Honduras&output=embed"
              loading="lazy"
          ></iframe>
        </div>

      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.reception-section {
  background: #f8f8f6;
  padding: 100px 24px;
}

.reception-container {
  max-width: 1100px;
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
  font-size: clamp(38px, 5vw, 60px);
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 36px;
}

.reception-card {
  width: 100%;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(157, 199, 236, 0.5);
  box-shadow: 0 24px 70px rgba(12, 37, 60, 0.10);
  overflow: hidden;
}

.reception-info {
  padding: 60px 40px;
  text-align: center;
}

.icon-circle {
  width: 66px;
  height: 66px;
  border-radius: 999px;
  margin: 0 auto 24px;
  background: #eaf3fb;
  color: #2984d1;
  border: 1px solid #9dc7ec;
  display: flex;
  align-items: center;
  justify-content: center;
}

h3 {
  font-family: Georgia, serif;
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 28px;
}

.info-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 17px;
  color: #236daf;
}

.reception-text {
  margin: 28px auto 32px;
  max-width: 480px;
  font-size: 18px;
  line-height: 1.8;
  color: #133d62;
}

.map-btn {
  text-transform: none;
  padding-inline: 30px;
}

.map-wrap {
  width: 100%;
  height: 360px;
  border-top: 1px solid rgba(157, 199, 236, 0.45);
}

.map-wrap iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

@media (max-width: 768px) {
  .reception-section {
    padding: 80px 18px;
  }

  .reception-info {
    padding: 40px 24px;
  }

  .map-wrap {
    height: 300px;
  }
}
</style>
