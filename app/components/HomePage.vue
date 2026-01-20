<template>
  <div class="home-page">

    <main class="home-content">
      <button class="cta-button" @click="goToReception">
        Commencer →
      </button>
    </main>

    <footer class="home-footer">
      <p>PWA Chat & Gallery © 2025 - Projet M1 TP1</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  navigate: [to: string];
}>();

function goToReception() {
  emit('navigate', 'reception');
}
</script>

<style scoped src="~/assets/css/HomePage.css"></style>
