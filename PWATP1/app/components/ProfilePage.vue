<template>
  <div class="profile-container" v-if="user">
    <h2>Mon profil</h2>
    <div class="profile-avatar-block">
      <img :src="avatarPreview || user.avatar" class="profile-avatar" alt="Photo de profil" />
      <input type="file" accept="image/*" @change="onAvatarChange" />
    </div>
    <div class="profile-field">
      <label for="pseudo">Pseudo</label>
      <input id="pseudo" v-model="pseudo" type="text" />
    </div>
    <button @click="saveProfile">Enregistrer</button>
    <p v-if="message" class="profile-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const user = ref<{ username: string, avatar?: string } | null>(null);
const pseudo = ref('');
const avatarPreview = ref<string | null>(null);
const message = ref('');

onMounted(() => {
  const u = localStorage.getItem('pwa_user');
  if (u) {
    const parsed = JSON.parse(u);
    user.value = parsed;
    pseudo.value = parsed.username;
  }
});

function onAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarPreview.value = ev.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
}

function saveProfile() {
  if (!user.value) return;
  user.value.username = pseudo.value;
  if (avatarPreview.value) user.value.avatar = avatarPreview.value;
  localStorage.setItem('pwa_user', JSON.stringify(user.value));
  message.value = 'Profil mis à jour !';
  setTimeout(() => message.value = '', 2000);
}
</script>

<style scoped>
.profile-container {
  margin-left: 240px;
  max-width: 400px;
  margin-top: 3rem;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-avatar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #2563eb;
  margin-bottom: 0.7rem;
  background: #f3f4f6;
}
.profile-field {
  width: 100%;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.profile-field label {
  color: #2563eb;
  font-weight: 500;
}
.profile-field input {
  padding: 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.profile-field input:focus {
  border-color: #2563eb;
}
button {
  padding: 0.8rem 2rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #1d4ed8;
}
.profile-message {
  color: #059669;
  margin-top: 1rem;
  font-weight: 500;
}
</style>
