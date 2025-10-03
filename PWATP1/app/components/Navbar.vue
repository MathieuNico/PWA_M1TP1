<template>
  <nav class="navbar">
    <div class="navbar-top">
      <div class="navbar-logo">PWA</div>
      <ul class="navbar-links">
        <li :class="{active: props.selected === 'profil'}" @click="select('profil')">
          <span class="icon">👤</span> Profil
        </li>
        <li :class="{active: props.selected === 'chat'}" @click="select('chat')">
          <span class="icon">💬</span> Chat
        </li>
      </ul>
    </div>
    <div class="navbar-bottom" v-if="user">
      <img v-if="user.avatar" :src="user.avatar" class="navbar-avatar" alt="Photo de profil" />
      <div class="navbar-username">{{ user.username }}</div>
    </div>
  </nav>
</template>

<script setup lang="ts">

import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';
const props = defineProps<{ selected: string }>();
const emit = defineEmits(['select']);
const user = ref<{ username: string, avatar?: string } | null>(null);

function select(tab: string) {
  emit('select', tab);
}

onMounted(() => {
  const u = localStorage.getItem('pwa_user');
  if (u) user.value = JSON.parse(u);
});
// Optionally, update user info if localStorage changes (e.g. after profile update)
window.addEventListener('storage', () => {
  const u = localStorage.getItem('pwa_user');
  if (u) user.value = JSON.parse(u);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  left: 0;
  top: 0;
  width: 220px;
  height: 100vh;
  background: linear-gradient(135deg, #2563eb 0%, #6ee7b7 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 12px rgba(0,0,0,0.08);
  z-index: 10;
}
.navbar-top {
  padding: 2rem 1rem 1rem 1.5rem;
}
.navbar-logo {
  font-size: 1.6rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 2.5rem;
  letter-spacing: 2px;
}
.navbar-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.navbar-links li {
  color: #fff;
  font-size: 1.15rem;
  padding: 0.7rem 1rem;
  border-radius: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.2s, color 0.2s;
}
.navbar-links li.active, .navbar-links li:hover {
  background: rgba(255,255,255,0.18);
  color: #1e293b;
}
.icon {
  font-size: 1.3rem;
}
.navbar-bottom {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.18);
}
.navbar-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  margin-bottom: 0.7rem;
  background: #fff;
}
.navbar-username {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}
</style>
