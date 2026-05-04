<template>
  <section className="tips-section">
    <div className="tips-container">
      <p className="section-kicker">Detalles importantes</p>

      <v-card className="tips-card" elevation="0">

        <p className="tips-text">
          Si decides acompañarnos, compartimos
          algunos detalles para que disfrutes al máximo:
        </p>

        <div className="tips-list">
          <div className="tip-item">
            <v-icon size="22">mdi-weather-sunny</v-icon>
            <span>La celebración será en verano, por lo que las temperaturas pueden ser elevadas.</span>
          </div>

          <div className="tip-item">
            <v-icon size="22">mdi-shoe-formal</v-icon>
            <span>El evento se realizará en un espacio al aire libre con césped, te recomendamos elegir un calzado cómodo.</span>
          </div>

          <div className="tip-item">
            <v-icon size="22">mdi-glass-cocktail</v-icon>
            <span>Contaremos con pista de baile para disfrutar juntos durante la celebración. Lleva tus mejores pasos.</span>
          </div>

          <div className="tip-item">
            <v-icon size="22">mdi-account-off</v-icon>
            <span>Con mucho cariño, esta será una celebración exclusivamente para adultos.</span>
          </div>

          <div class="tip-item">
            <v-icon size="22">mdi-gift-outline</v-icon>
            <span>No hay mejor regalo que celebrar juntos. pero si quieres tener un detalle con nosotros puedes hacerlo en efectivo.</span>
          </div>
        </div>

      </v-card>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.tips-section {
  background: #f8f8f6; /* 👈 fondo claro (como pediste) */
  padding: 100px 24px;
}

.tips-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

/* TITULOS */
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

/* CARD */
.tips-card {
  padding: 50px 40px;
  border-radius: 34px;

  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(157, 199, 236, 0.6);
  box-shadow: 0 20px 60px rgba(12, 37, 60, 0.12);
}

/* TEXTO */
.tips-text {
  font-size: 17px;
  line-height: 1.8;
  color: #133d62;
  margin-bottom: 30px;
}

/* LISTA */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: left;
}

.tip-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: #0c253c;
  font-size: 16px;
  line-height: 1.6;
}

.tip-item v-icon {
  color: #2984d1;
  margin-top: 3px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .tips-section {
    padding: 80px 18px;
  }

  .tips-card {
    padding: 36px 24px;
  }

  .tip-item {
    font-size: 15px;
  }
}
</style>
