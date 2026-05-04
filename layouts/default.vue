<template>
  <v-app>
    <v-app-bar flat class="nav-bar">
      <div class="nav-container">
        <a href="#" class="nav-logo">Williams & Andrea</a>

        <nav class="nav-links">
          <a href="#evento">Evento</a>
          <a href="#galeria">Galería</a>
          <a href="#asistencia">Asistencia</a>
        </nav>
      </div>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer class="footer">
      <div class="footer-content">
        <p>Andrea & Williams</p>
        <small>Gracias por ser parte de nuestra historia.</small>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 76px !important;
  z-index: 100;
  background: rgba(234, 243, 251, 0.88) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(119, 177, 228, 0.25);
}

.nav-container {
  width: 100%;
  max-width: 1180px;
  height: 76px;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  text-decoration: none;
  font-family: "Monsieur La Doulaise", cursive;
  font-size: 34px;
  color: #0c253c;
  white-space: nowrap;
  margin-right: 60px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 34px;
}

.nav-links a {
  position: relative;
  text-decoration: none;
  color: #133d62;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2.4px;
  transition: color 0.25s ease;
}

.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 0;
  height: 1px;
  background: #2984d1;
  transition: width 0.25s ease;
}

.nav-links a:hover {
  color: #2984d1;
}

.nav-links a:hover::after {
  width: 100%;
}

.footer {
  background: #eaf3fb;
  border-top: 1px solid rgba(119, 177, 228, 0.22);
  padding: 42px 20px;
  text-align: center;
}

.footer-content {
  width: 100%;
}

.footer-content p {
  font-family: "Monsieur La Doulaise", cursive;
  font-size: 34px;
  color: #0c253c;
  margin-bottom: 6px;
}

.footer-content small {
  color: #133d62;
}

@media (max-width: 768px) {
  .nav-container {
    justify-content: center;
  }

  .nav-logo {
    margin-right: 0;
    font-size: 32px;
  }

  .nav-links {
    display: none;
  }
}
</style>
