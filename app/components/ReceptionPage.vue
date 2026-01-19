<template>
  <div class="reception-page">
    <header class="reception-header">
      <button class="back-btn" @click="goBack">← Retour</button>
      <div class="header-content">
        <h1>🎯 Réception</h1>
        <BatteryIndicator />
      </div>
    </header>

    <div class="reception-content">
      <!-- Login Section -->
      <section v-if="!user" class="login-section">
        <div class="login-card">
          <h2>Connexion</h2>
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="pseudo">Pseudo</label>
              <input 
                id="pseudo" 
                v-model="pseudo" 
                type="text" 
                required 
                placeholder="Votre pseudo"
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label>Photo de profil</label>
              <div class="avatar-section">
                <div class="avatar-preview" @click="openCamera">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar" />
                  <span v-else class="avatar-placeholder">📸</span>
                </div>
                <button type="button" @click="openCamera" class="photo-btn">
                  Prendre une photo
                </button>
              </div>
            </div>

            <button type="submit" class="submit-btn">Se connecter</button>
            <p v-if="error" class="error">{{ error }}</p>
          </form>
        </div>
      </section>

      <!-- Rooms List Section -->
      <section v-else class="rooms-section">
        <div class="user-info">
          <img v-if="user.avatar" :src="user.avatar" class="user-avatar" alt="Avatar" />
          <div>
            <h3>Bienvenue, {{ user.username }} !</h3>
            <button @click="logout" class="logout-btn">Déconnexion</button>
          </div>
        </div>

        <div class="rooms-container">
          <div class="rooms-header">
            <h2>Salles de discussion</h2>
            <button @click="showCreateRoom = true" class="create-room-btn">
              ➕ Créer une salle
            </button>
          </div>

          <div v-if="rooms.length === 0" class="empty-rooms">
            <p>Aucune salle disponible. Créez-en une !</p>
          </div>

          <div v-else class="rooms-list">
            <div 
              v-for="room in rooms" 
              :key="room.id" 
              class="room-card"
              @click="joinRoom(room.id)"
            >
              <div class="room-icon">💬</div>
              <div class="room-info">
                <h3>{{ room.name }}</h3>
                <p>{{ room.description }}</p>
                <span class="room-meta">Créée le {{ formatDate(room.createdAt) }}</span>
              </div>
              <button class="delete-room-btn" @click.stop="deleteRoom(room.id)">🗑️</button>
            </div>
          </div>
        </div>

        <button @click="goToGallery" class="gallery-btn">
          🖼️ Voir la galerie
        </button>
      </section>

      <!-- Create Room Modal -->
      <div v-if="showCreateRoom" class="modal-overlay" @click="showCreateRoom = false">
        <div class="modal-content" @click.stop>
          <h3>Créer une nouvelle salle</h3>
          <form @submit.prevent="createRoom">
            <div class="form-group">
              <label for="roomName">Nom de la salle</label>
              <input 
                id="roomName" 
                v-model="newRoomName" 
                type="text" 
                required 
                placeholder="Ex: Discussion générale"
              />
            </div>
            <div class="form-group">
              <label for="roomDesc">Description</label>
              <textarea 
                id="roomDesc" 
                v-model="newRoomDesc" 
                placeholder="Description de la salle"
                rows="3"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="showCreateRoom = false" class="cancel-btn">
                Annuler
              </button>
              <button type="submit" class="submit-btn">Créer</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Camera Component -->
    <CameraCapture 
      :isOpen="cameraOpen" 
      @close="cameraOpen = false" 
      @capture="onPhotoCapture"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import CameraCapture from './CameraCapture.vue';
import BatteryIndicator from './BatteryIndicator.vue';

interface User {
  username: string;
  avatar?: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

const navigate = inject<(to: string, params?: any) => void>('navigate');

const user = ref<User | null>(null);
const pseudo = ref('');
const avatarPreview = ref<string | null>(null);
const error = ref('');
const cameraOpen = ref(false);

const rooms = ref<Room[]>([]);
const showCreateRoom = ref(false);
const newRoomName = ref('');
const newRoomDesc = ref('');

onMounted(() => {
  loadUser();
  loadRooms();
  requestNotificationPermission();
});

function loadUser() {
  const stored = localStorage.getItem('pwa_user');
  if (stored) {
    user.value = JSON.parse(stored);
    avatarPreview.value = user.value?.avatar || null;
  }
}

function loadRooms() {
  const stored = localStorage.getItem('pwa_rooms');
  if (stored) {
    rooms.value = JSON.parse(stored);
  }
}

function saveRooms() {
  localStorage.setItem('pwa_rooms', JSON.stringify(rooms.value));
}

function openCamera() {
  cameraOpen.value = true;
}

function onPhotoCapture(imageData: string) {
  avatarPreview.value = imageData;
  sendNotification('Photo capturée !', 'Votre photo de profil a été mise à jour.');
}

function login() {
  if (!pseudo.value) {
    error.value = 'Veuillez entrer un pseudo';
    return;
  }

  const newUser: User = {
    username: pseudo.value,
    avatar: avatarPreview.value || undefined
  };

  localStorage.setItem('pwa_user', JSON.stringify(newUser));
  user.value = newUser;
  error.value = '';
  
  sendNotification('Connexion réussie !', `Bienvenue ${pseudo.value} !`);
}

function logout() {
  localStorage.removeItem('pwa_user');
  user.value = null;
  pseudo.value = '';
  avatarPreview.value = null;
}

function createRoom() {
  if (!newRoomName.value) return;

  const room: Room = {
    id: `room_${Date.now()}`,
    name: newRoomName.value,
    description: newRoomDesc.value,
    createdAt: Date.now()
  };

  rooms.value.push(room);
  saveRooms();

  newRoomName.value = '';
  newRoomDesc.value = '';
  showCreateRoom.value = false;
  
  sendNotification('Salle créée !', `La salle "${room.name}" a été créée.`);
}

function deleteRoom(roomId: string) {
  if (confirm('Voulez-vous vraiment supprimer cette salle ?')) {
    rooms.value = rooms.value.filter(r => r.id !== roomId);
    saveRooms();
    
    // Also delete room messages
    localStorage.removeItem(`pwa_messages_${roomId}`);
  }
}

function joinRoom(roomId: string) {
  if (navigate) {
    navigate('room', { roomId });
  }
}

function goToGallery() {
  if (navigate) navigate('gallery');
}

function goBack() {
  if (navigate) navigate('home');
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR');
}

async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

function sendNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192x192.png' });
  }
}
</script>

<style scoped>
.reception-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.reception-header {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #fff;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.3);
}

.reception-content {
  padding: 2rem 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.login-card {
  background: #fff;
  border-radius: 1.2rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 420px;
}

.login-card h2 {
  color: #667eea;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #667eea;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #667eea;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  transition: transform 0.2s;
}

.avatar-preview:hover {
  transform: scale(1.05);
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 2rem;
}

.photo-btn {
  background: #667eea;
  color: #fff;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.photo-btn:hover {
  background: #5568d3;
}

.submit-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 0.6rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.error {
  color: #dc2626;
  text-align: center;
  margin-top: 1rem;
}

.rooms-section {
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
}

.user-info h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.logout-btn {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #b91c1c;
}

.rooms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.rooms-header h2 {
  color: #374151;
}

.create-room-btn {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
}

.create-room-btn:hover {
  background: #059669;
}

.empty-rooms {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  font-size: 1.1rem;
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.room-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.room-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 0.8rem;
}

.room-info {
  flex: 1;
}

.room-info h3 {
  color: #667eea;
  margin-bottom: 0.3rem;
}

.room-info p {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}

.room-meta {
  font-size: 0.85rem;
  color: #9ca3af;
}

.delete-room-btn {
  background: #dc2626;
  color: #fff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.2s;
}

.delete-room-btn:hover {
  background: #b91c1c;
}

.gallery-btn {
  width: 100%;
  margin-top: 2rem;
  padding: 1rem;
  background: #8b5cf6;
  color: #fff;
  border: none;
  border-radius: 0.6rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.gallery-btn:hover {
  background: #7c3aed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.modal-content h3 {
  color: #667eea;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  flex: 1;
  padding: 0.8rem;
  background: #6b7280;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #4b5563;
}
</style>
