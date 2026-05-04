<template>
  <v-app>
    <v-navigation-drawer
        v-model="drawer"
        width="280"
        class="admin-drawer"
        temporary
    >
      <div class="drawer-header">
        <div class="seal">AW</div>
        <h3>Andrea & Williams</h3>
        <p>Panel del evento</p>
      </div>

      <v-list nav density="comfortable">
        <v-list-item
            to="/admin/evento"
            prepend-icon="mdi-view-dashboard-outline"
            title="Resumen"
        />

        <v-list-item
            to="/admin/evento/invitados"
            prepend-icon="mdi-account-group-outline"
            title="Invitados"
        />

        <v-list-item
            to="/admin/evento/mesas"
            prepend-icon="mdi-table-chair"
            title="Mesas"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat class="admin-bar">
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-toolbar-title>Administración del evento</v-toolbar-title>
    </v-app-bar>

    <v-main class="admin-main">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const drawer = ref(true)
</script>

<style scoped>
.admin-drawer {
  background: #fff8f1;
  border-right: 1px solid rgba(180, 145, 100, 0.18);
}

.drawer-header {
  text-align: center;
  padding: 34px 20px 24px;
}

.seal {
  width: 70px;
  height: 70px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #d7b98a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Brush Script MT", "Segoe Script", cursive;
  font-size: 32px;
  color: #8a643d;
}

.drawer-header h3 {
  font-family: Georgia, serif;
  color: #2f2923;
}

.drawer-header p {
  color: #8a643d;
}

.admin-bar {
  background: rgba(255, 248, 241, 0.9) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(180, 145, 100, 0.18);
}

.admin-main {
  background: #fff8f1;
  min-height: 100vh;
  padding: 30px;
}
</style>
