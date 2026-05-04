<template>
  <section class="parents-section">
    <div class="parents-container">

      <p class="parents-intro">
        Bendecidos por Dios y rodeados del amor de nuestros padres
      </p>

      <v-card class="parent-card" elevation="0">
        <div class="parent-block">
          <p class="parent-title">Padres del novio</p>

          <p class="parent-name">Oscar Omar Santos</p>
          <p class="parent-name">Josefina Lainez Sandoval</p>
        </div>

        <div class="divider"></div>

        <div class="parent-block">
          <p class="parent-title">Padres de la novia</p>

          <p
              class="parent-name clickable"
              @click="openModal = true"
          >
            Francisco Esteban Sosa Martinez
            <span class="cross">†</span>
          </p>

          <p class="parent-name">Elsy Beatriz Mejia Fuentes</p>
        </div>
      </v-card>
    </div>

    <!-- MODAL -->
    <v-dialog v-model="openModal" max-width="360">
      <v-card class="photo-modal" elevation="0">
        <img src="/images/FESM.jpeg" alt="Foto" class="photo-img" />
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
const openModal = ref(false)
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

.parents-intro {
  max-width: 560px;
  margin: 0 auto 34px;
  font-size: 16px;
  line-height: 1.8;
  color: #236daf;
  letter-spacing: 2.5px;
  text-transform: uppercase;
}

/* CARD */
.parent-card {
  padding: 48px 34px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(157, 199, 236, 0.55);
  box-shadow: 0 20px 60px rgba(12, 37, 60, 0.10);
}

/* BLOQUES */
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

/* NOMBRES */
.parent-name {
  font-size: clamp(15px, 3vw, 26px);
  font-weight: 500;
  color: #0c253c;
  margin: 0;
  line-height: 1.35;
}

/* CLICK SUTIL */
.clickable {
  cursor: pointer;
  position: relative;
}

.clickable::after {
  content: '';
  display: block;
  width: 0%;
  height: 1px;
  background: #9dc7ec;
  margin: 4px auto 0;
  transition: width 0.3s ease;
}

.clickable:hover::after {
  width: 40%;
}

/* CRUZ */
.cross {
  font-size: 18px;
  color: #000;
  vertical-align: super;
  margin-left: 2px;
}

/* DIVIDER */
.divider {
  width: 90px;
  height: 1px;
  background: #9dc7ec;
  margin: 36px auto;
}

/* MODAL */
.photo-modal {
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* IMAGEN CIRCULAR */
.photo-img {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 20%; /* 👈 ajusta el encuadre */
}

/* RESPONSIVE */
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

  .photo-img {
    width: 220px;
    height: 220px;
  }
}
</style>
