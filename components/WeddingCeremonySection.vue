<template>
  <section id="evento" class="ceremony-section">
    <div class="ceremony-container">
      <p class="section-kicker">Ceremonia religiosa</p>

      <v-card class="ceremony-card" elevation="0">
        <v-row no-gutters>
<!--          <v-col cols="12" md="6">-->
<!--            <v-img-->
<!--                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop"-->
<!--                height="100%"-->
<!--                min-height="420"-->
<!--                cover-->
<!--                class="ceremony-img"-->
<!--            />-->
<!--          </v-col>-->

          <v-col cols="12" md="6">
            <div class="ceremony-info">
              <div class="icon-circle">
                <v-icon size="28">mdi-church</v-icon>
              </div>

              <h3>Capilla Universidad Católica de Honduras</h3>

              <div class="info-row">
                <v-icon size="22">mdi-map-marker</v-icon>
                <span>La Ceiba, Atlántida</span>
              </div>

              <div class="info-row">
                <v-icon size="22">mdi-clock-outline</v-icon>
                <span>2:00 PM</span>
              </div>

              <p class="ceremony-text">
                Nos encantaría contar con tu presencia en nuestra ceremonia religiosa,
                donde daremos gracias a Dios por este nuevo comienzo.
              </p>

              <v-btn
                  href="https://www.google.com/maps/search/?api=1&query=Capilla%20Universidad%20Cat%C3%B3lica%20de%20Honduras%20La%20Ceiba%20Honduras"
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
          </v-col>
        </v-row>

        <div class="map-wrap">
          <iframe
              src="https://www.google.com/maps?q=Capilla%20Universidad%20Cat%C3%B3lica%20de%20Honduras%20La%20Ceiba%20Honduras&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ceremony-section {
  background: #eaf3fb;
  padding: 100px 24px;
}

.ceremony-container {
  max-width: 1120px;
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

.ceremony-card {
  overflow: hidden;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(157, 199, 236, 0.55);
  box-shadow: 0 24px 70px rgba(12, 37, 60, 0.12);
}

.ceremony-img {
  border-radius: 0;
}

.ceremony-info {
  height: 100%;
  padding: 54px 46px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icon-circle {
  width: 66px;
  height: 66px;
  border-radius: 999px;
  margin: 0 auto 24px;
  background: #f8f8f6;
  color: #2984d1;
  border: 1px solid #9dc7ec;
  display: flex;
  align-items: center;
  justify-content: center;
}

h3 {
  font-family: Georgia, serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 28px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 14px;
  color: #236daf;
  font-size: 17px;
}

.ceremony-text {
  margin: 24px auto 28px;
  max-width: 430px;
  font-size: 17px;
  line-height: 1.8;
  color: #133d62;
}

.map-btn {
  align-self: center;
  text-transform: none;
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
  .ceremony-section {
    padding: 80px 18px;
  }

  .ceremony-info {
    padding: 38px 24px;
  }

  .map-wrap {
    height: 300px;
  }
}
</style>
