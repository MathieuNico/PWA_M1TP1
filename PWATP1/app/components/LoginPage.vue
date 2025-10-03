
<template>
  <div class="login-container" v-if="!isAuthenticated">
    <form class="login-form" @submit.prevent="login">
      <h2>Connexion</h2>
      <div class="input-group">
        <label for="username">Nom d'utilisateur</label>
        <input id="username" v-model="username" type="text" required autocomplete="username" />
      </div>
      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="password" type="password" required autocomplete="current-password" />
      </div>
      <div class="input-group">
        <label for="avatar">Photo de profil</label>
        <input id="avatar" type="file" accept="image/*" @change="onAvatarChange" />
        <img v-if="avatarPreview" :src="avatarPreview" alt="Prévisualisation" class="avatar-preview" />
      </div>
      <button type="submit">Se connecter</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
  <div v-else class="welcome-container">
    <div v-if="storedUser?.avatar" class="avatar-welcome">
      <img :src="storedUser.avatar" alt="Photo de profil" class="avatar-welcome-img" />
    </div>
    <h2>Bienvenue, {{ storedUser?.username }} !</h2>
    <button @click="logout">Se déconnecter</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const username = ref('');
const password = ref('');
const error = ref('');
const avatar = ref<File|null>(null);
const avatarPreview = ref<string|null>(null);
const storedUser = ref<{ username: string, avatar?: string } | null>(null);

const isAuthenticated = computed(() => !!storedUser.value);

onMounted(() => {
  const user = localStorage.getItem('pwa_user');
  if (user) {
    storedUser.value = JSON.parse(user);
  }
});

function onAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    avatar.value = target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarPreview.value = ev.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
}

function login() {
  if (username.value && password.value) {
    let avatarData = avatarPreview.value || undefined;
    const user = { username: username.value, ...(avatarData ? { avatar: avatarData } : {}) };
    localStorage.setItem('pwa_user', JSON.stringify(user));
    storedUser.value = user;
    error.value = '';
  } else {
    error.value = 'Veuillez remplir tous les champs.';
  }
}

function logout() {
  localStorage.removeItem('pwa_user');
  storedUser.value = null;
  username.value = '';
  password.value = '';
  avatar.value = null;
  avatarPreview.value = null;
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f8cff 0%, #6ee7b7 100%);
}
.login-form {
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.login-form h2 {
  margin-bottom: 0.5rem;
  color: #2563eb;
  text-align: center;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.input-group label {
  font-size: 1rem;
  color: #374151;
}
.input-group input {
  padding: 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.input-group input:focus {
  border-color: #2563eb;
}
.login-form button {
  padding: 0.8rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.login-form button:hover {
  background: #1d4ed8;
}
.error {
  color: #dc2626;
  text-align: center;
  margin-top: -0.5rem;
}
.avatar-preview {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0.5rem auto;
  display: block;
  border: 2px solid #2563eb;
}
.welcome-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f8cff 0%, #6ee7b7 100%);
}
.welcome-container h2 {
  color: #2563eb;
  margin-bottom: 2rem;
}
.avatar-welcome {
  margin-bottom: 1.5rem;
}
.avatar-welcome-img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #2563eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.welcome-container button {
  padding: 0.8rem 2rem;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.welcome-container button:hover {
  background: #b91c1c;
}
</style>


