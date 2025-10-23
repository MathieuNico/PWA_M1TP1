
<template>
  <div class="app-container">
    <HomePage v-if="currentRoute === 'home'" @navigate="navigate" />
    <ReceptionPage v-else-if="currentRoute === 'reception'" @navigate="navigate" />
    <RoomPage v-else-if="currentRoute === 'room'" @navigate="navigate" />
    <GalleryPage v-else-if="currentRoute === 'gallery'" @navigate="navigate" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';

const currentRoute = ref('home');
const currentRoomId = ref<string | null>(null);

function navigate(to: string, params?: any) {
  currentRoute.value = to;
  if (params?.roomId) {
    currentRoomId.value = params.roomId;
  }
}

onMounted(() => {
  // Check if user is already logged in
  const user = localStorage.getItem('pwa_user');
  if (!user && currentRoute.value !== 'home') {
    currentRoute.value = 'home';
  }
});

// Provide navigation and room context
provide('navigate', navigate);
provide('currentRoomId', currentRoomId);
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f3f4f6;
}

.app-container {
  min-height: 100vh;
}
</style>
