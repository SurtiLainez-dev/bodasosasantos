<template>
  <section id="galeria" class="gallery-section">
    <div class="gallery-container">
      <p class="section-kicker">Recuerdos</p>
      <h2>Nuestra galería</h2>

      <p class="gallery-intro">
        Algunos momentos que guardamos con mucho cariño y que forman parte
        de nuestra historia.
      </p>

      <div class="gallery-grid">
        <div
            v-for="(photo, index) in photos"
            :key="index"
            class="gallery-item"
            :class="photo.class"
        >
          <v-img
              :src="photo.src"
              cover
              class="gallery-img"
          >
            <div class="photo-overlay">
              <v-icon size="24">mdi-heart</v-icon>
            </div>
          </v-img>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const photos = [
  {src: '/images/portada11.jpeg', class: 'wide'},
  {src: '/images/portada12.jpeg', class: 'wide'},
  {src: '/images/portada13.jpeg', class: 'wide'},
  {src: '/images/portada14.jpeg', class: 'wide'},
  {src: '/images/ft1.jpeg', class: 'wide'},
  {src: '/images/ft2.jpeg', class: 'wide'},
  {src: '/images/ft3.jpeg', class: 'wide'},
  {src: '/images/ft4.jpeg', class: 'wide'},
  {src: '/images/ft5.jpeg', class: 'wide'},

]
</script>

<style scoped>
.gallery-section {
  background: #f8f8f6; /* 👈 fondo claro para contraste */
  padding: 100px 24px;
}

.gallery-container {
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
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 400;
  color: #0c253c;
  margin-bottom: 20px;
}

.gallery-intro {
  max-width: 620px;
  margin: 0 auto 46px;
  font-size: 18px;
  line-height: 1.8;
  color: #133d62;
}

.gallery-grid {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(3, 260px);
  justify-content: center;
  gap: 18px;
}

.gallery-item {
  height: 230px;
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(157, 199, 236, 0.5);
  box-shadow: 0 18px 45px rgba(12, 37, 60, 0.10);
}

.gallery-item.large,
.gallery-item.wide {
  grid-column: auto;
  grid-row: auto;
}

.gallery-img {
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
}

/* 🔥 overlay adaptado a azul elegante */
.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      to top,
      rgba(12, 37, 60, 0.35),
      rgba(234, 243, 251, 0.05)
  );
  color: #ffffff;

  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px;

  opacity: 0;
  transition: opacity 0.35s ease;
}

.gallery-item:hover .gallery-img {
  transform: scale(1.06);
}

.gallery-item:hover .photo-overlay {
  opacity: 1;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 620px;
  }
}

@media (max-width: 560px) {
  .gallery-section {
    padding: 80px 18px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    max-width: 360px;
  }

  .gallery-item {
    height: 300px;
  }
}
</style>
