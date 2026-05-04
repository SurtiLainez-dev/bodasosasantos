<!--<template>-->
<!--  <div class="wedding-page">-->
<!--    <section class="hero">-->
<!--      <div class="hero-overlay"></div>-->

<!--      <div class="hero-content">-->
<!--        <div class="hero-card">-->
<!--          <h2 class="couple-names">Williams & Andrea</h2>-->

<!--          <p class="hero-kicker">Queremos invitarte a celebrar</p>-->

<!--          <h1 class="hero-title">Nuestra boda</h1>-->

<!--          <div class="hero-line"></div>-->

<!--          <p class="hero-text">-->
<!--            Queremos que seas parte de este capítulo tan importante en nuestras vidas.-->
<!--            Tu presencia hará de este día un recuerdo aún más hermoso e inolvidable.-->
<!--          </p>-->

<!--          <div class="date-pill">-->
<!--            <v-icon size="22">mdi-calendar-heart</v-icon>-->
<!--            <span>29 de Agosto de 2026</span>-->
<!--          </div>-->

<!--          <p class="hero-note">-->
<!--            Con amor, alegría y gratitud, queremos vivir este momento contigo.-->
<!--          </p>-->

<!--          <v-btn-->
<!--              href="#asistencia"-->
<!--              rounded="xl"-->
<!--              size="large"-->
<!--              color="primary"-->
<!--              class="hero-btn"-->
<!--          >-->
<!--            Confirmar asistencia-->
<!--          </v-btn>-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->

<!--    <ParentsSection />-->
<!--    <WeddingCeremonySection />-->
<!--    <WeddingReceptionSection />-->
<!--    <DressCodeSection />-->
<!--    <WeddingGallerySection />-->
<!--    <WeddingRsvpSection />-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import WeddingCeremonySection from "~/components/WeddingCeremonySection.vue";-->
<!--import WeddingReceptionSection from "~/components/WeddingReceptionSection.vue";-->
<!--import DressCodeSection from "~/components/DressCodeSection.vue";-->
<!--import WeddingGallerySection from "~/components/WeddingGallerySection.vue";-->
<!--import WeddingRsvpSection from "~/components/WeddingRsvpSection.vue";-->
<!--import ParentsSection from "~/components/ParentsSection.vue";-->
<!--</script>-->

<!--<style scoped>-->
<!--.wedding-page {-->
<!--  background: #eaf3fb;-->
<!--  color: #0c253c;-->
<!--}-->

<!--.hero {-->
<!--  min-height: 100vh;-->
<!--  padding: 120px 8% 60px;-->
<!--  background-image: url('/images/portada4.jpeg');-->
<!--  background-size: 101%;-->
<!--  background-position: 35% center;-->
<!--  background-repeat: no-repeat;-->
<!--  position: relative;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: flex-end;-->
<!--}-->

<!--.hero-overlay {-->
<!--  position: absolute;-->
<!--  inset: 0;-->
<!--  background: linear-gradient(-->
<!--      to right,-->
<!--      rgba(234, 243, 251, 0.08),-->
<!--      rgba(234, 243, 251, 0.42),-->
<!--      rgba(234, 243, 251, 0.92)-->
<!--  );-->
<!--}-->

<!--.hero-content {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  max-width: 560px;-->
<!--}-->

<!--.hero-card {-->
<!--  background: rgba(255, 255, 255, 0.72);-->
<!--  backdrop-filter: blur(10px);-->
<!--  border: 1px solid rgba(157, 199, 236, 0.55);-->
<!--  border-radius: 34px;-->
<!--  padding: 46px 42px;-->
<!--  text-align: center;-->
<!--  box-shadow: 0 24px 70px rgba(12, 37, 60, 0.14);-->
<!--}-->

<!--.hero-kicker {-->
<!--  font-size: 14px;-->
<!--  letter-spacing: 4px;-->
<!--  text-transform: uppercase;-->
<!--  color: #2984d1;-->
<!--  margin-bottom: 14px;-->
<!--}-->

<!--.hero-title {-->
<!--  font-family: "Parisienne", cursive;-->
<!--  font-size: clamp(62px, 7vw, 70px);-->
<!--  font-weight: 400;-->
<!--  color: #133d62;-->
<!--  line-height: 0.95;-->
<!--  margin: 0;-->
<!--}-->

<!--.hero-line {-->
<!--  width: 90px;-->
<!--  height: 1px;-->
<!--  background: #77b1e4;-->
<!--  margin: 30px auto;-->
<!--}-->

<!--.couple-names {-->
<!--  font-family: "Monsieur La Doulaise", cursive;-->
<!--  font-size: clamp(54px, 6vw, 65px);-->
<!--  font-weight: 400;-->
<!--  color: #0c253c;-->
<!--  font-style: normal;-->
<!--  letter-spacing: 1px;-->
<!--}-->

<!--.hero-text {-->
<!--  font-size: 18px;-->
<!--  line-height: 1.8;-->
<!--  color: #133d62;-->
<!--  margin-bottom: 26px;-->
<!--}-->

<!--.date-pill {-->
<!--  display: inline-flex;-->
<!--  align-items: center;-->
<!--  gap: 10px;-->
<!--  background: #f8f8f6;-->
<!--  border: 1px solid #9dc7ec;-->
<!--  color: #0c253c;-->
<!--  padding: 13px 22px;-->
<!--  border-radius: 999px;-->
<!--  font-size: 17px;-->
<!--  font-weight: 500;-->
<!--  margin-bottom: 26px;-->
<!--}-->

<!--.hero-note {-->
<!--  font-family: "Parisienne", cursive;-->
<!--  font-size: 35px;-->
<!--  color: #236daf;-->
<!--  line-height: 1.5;-->
<!--  margin-bottom: 28px;-->
<!--}-->

<!--.hero-btn {-->
<!--  text-transform: none;-->
<!--  letter-spacing: 0.3px;-->
<!--  padding-inline: 34px;-->
<!--}-->

<!--@media (max-width: 900px) {-->
<!--  .hero {-->
<!--    justify-content: center;-->
<!--    background-size: cover;-->
<!--    background-position: center;-->
<!--    padding: 110px 18px 60px;-->
<!--  }-->

<!--  .hero-overlay {-->
<!--    background: rgba(234, 243, 251, 0.76);-->
<!--  }-->

<!--  .hero-card {-->
<!--    padding: 34px 24px;-->
<!--    border-radius: 28px;-->
<!--  }-->

<!--  .hero-text {-->
<!--    font-size: 16px;-->
<!--  }-->

<!--  .date-pill {-->
<!--    font-size: 15px;-->
<!--  }-->
<!--}-->
<!--</style>-->

<template>
  <div class="wedding-page">
    <section class="hero">
      <!-- CARRUSEL 70% -->
      <div class="hero-gallery">
        <v-carousel
            cycle
            interval="4500"
            hide-delimiter-background
            show-arrows="hover"
            class="hero-carousel"
        >
          <v-carousel-item
              v-for="(img, index) in heroImages"
              :key="index"
          >
            <v-img
                :src="img"
                cover
                class="hero-img"
            />
          </v-carousel-item>
        </v-carousel>

        <div class="hero-photo-overlay"></div>
      </div>

      <!-- CARD 30% -->
      <div class="hero-info">
        <div class="hero-card">
          <h2 class="couple-names">Williams & Andrea</h2>

          <p class="hero-kicker">Deseamos invitarte a celebrar</p>

          <h1 class="hero-title">Nuestra boda</h1>

          <div class="hero-line"></div>

          <p class="hero-text">
            Tu presencia hará de este día un recuerdo aún más hermoso e inolvidable.
          </p>

          <div class="date-pill">
            <v-icon size="22">mdi-calendar-heart</v-icon>
            <span>29 de agosto de 2026</span>
          </div>

          <p class="hero-note">
            Con amor, alegría y gratitud, queremos vivir este momento contigo.
          </p>

        </div>
      </div>
    </section>

    <ParentsSection />
    <WeddingCeremonySection />
    <WeddingReceptionSection  />
    <DressCodeSection v-if="invitacionValida" />
    <TipSection/>
    <WeddingRsvpSection :show-whatsapp="invitacionValida" />
    <WeddingGallerySection />
  </div>
</template>

<script setup lang="ts">
import WeddingCeremonySection from "~/components/WeddingCeremonySection.vue"
import WeddingReceptionSection from "~/components/WeddingReceptionSection.vue"
import DressCodeSection from "~/components/DressCodeSection.vue"
import WeddingGallerySection from "~/components/WeddingGallerySection.vue"
import WeddingRsvpSection from "~/components/WeddingRsvpSection.vue"
import ParentsSection from "~/components/ParentsSection.vue"
import TipSection from "~/components/TipSection.vue";
import WeddingConfirmedGuestsSection from "~/components/WeddingConfirmedGuestsSection.vue";

const invitacionValida = useState('invitacionValida', () => false)
const heroImages = [
  '/images/portada4.jpeg',
  '/images/portada14.jpeg',
  '/images/portada11.jpeg',
  '/images/portada12.jpeg',
  '/images/portada13.jpeg'
]
</script>

<style scoped>
.wedding-page {
  background: #eaf3fb;
  color: #0c253c;
}

/* HERO */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 70% 30%;
  background: #eaf3fb;
  position: relative;
  overflow: hidden;
}

/* CARRUSEL */
.hero-gallery {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.hero-carousel {
  height: 100vh !important;
}

.hero-img {
  height: 100vh;
}

.hero-photo-overlay {
  position: absolute;
  inset: 0;

  background:
      linear-gradient(
          to right,
          rgba(12, 37, 60, 0.20),
          rgba(41, 132, 209, 0.12),
          rgba(234, 243, 251, 0.28)
      ),
      linear-gradient(
          to bottom,
          rgba(19, 61, 98, 0.10),
          rgba(234, 243, 251, 0.08)
      );

  pointer-events: none;
}

/* CARD AREA */
/* CARD AREA */
.hero-info {
  min-height: 100vh;
  padding: 0; /* 👈 antes tenía padding */
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: linear-gradient(
      to bottom,
      #eaf3fb,
      #f8f8f6
  );
}

.hero-card {
  width: 100%;
  height: 100vh; /* 👈 ocupa todo el alto */
  max-width: none; /* 👈 ocupa todo el 30% */
  border-radius: 0; /* 👈 para que sea bloque completo */
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(157, 199, 236, 0.58);
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
  padding: 110px 42px 60px;
  text-align: center;
  box-shadow: -18px 0 70px rgba(12, 37, 60, 0.10);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-kicker {
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #2984d1;
  margin-bottom: 14px;
}

.hero-title {
  font-family: "Parisienne", cursive;
  font-size: clamp(20px, 6vw, 50px);
  font-weight: 400;
  color: #133d62;
  line-height: 0.95;
  margin: 0;
}

.hero-line {
  width: 90px;
  height: 1px;
  background: #77b1e4;
  margin: 26px auto;
}

.couple-names {
  font-family: "Parisienne", cursive;
  font-size: clamp(40px, 5vw, 100px);
  font-weight: 400;
  color: #0c253c;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.hero-text {
  font-size: 16px;
  line-height: 1.8;
  color: #133d62;
  margin-bottom: 24px;
}

.date-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #f8f8f6;
  border: 1px solid #9dc7ec;
  color: #0c253c;
  padding: 12px 18px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero-note {
  font-family: "Parisienne", cursive;
  font-size: 30px;
  color: #236daf;
  line-height: 1.4;
  margin-bottom: 26px;
}

.hero-btn {
  text-transform: none;
  letter-spacing: 0.3px;
  padding-inline: 34px;
}

/* TABLET: aquí empieza antes la transición */
@media (max-width: 1250px) {
  .hero {
    grid-template-columns: 60% 40%;
  }

  .hero-card {
    padding: 100px 32px 50px;
  }
}

/* MOBILE / TABLET PEQUEÑO */
@media (max-width: 980px) {
  .hero {
    display: block;
    min-height: 100vh;
    position: relative;
  }

  .hero-gallery {
    position: absolute;
    inset: 0;
    min-height: 100vh;
  }

  .hero-carousel,
  .hero-img {
    height: 100vh !important;
  }

  .hero-photo-overlay {
    background: rgba(234, 243, 251, 0.62);
  }

  .hero-info {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 110px 18px 60px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-card {
    width: 100%;
    height: auto; /* 👈 en móvil vuelve normal */
    max-width: 420px;
    padding: 34px 24px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.40);
    border: 1px solid rgba(157, 199, 236, 0.58);
    box-shadow: 0 24px 70px rgba(12, 37, 60, 0.16);
  }

  .hero-text {
    font-size: 15px;
  }

  .date-pill {
    font-size: 14px;
    flex-wrap: wrap;
  }

  .hero-note {
    font-size: 28px;
  }
}
</style>
