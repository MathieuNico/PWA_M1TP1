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

// Update Room interface to match API if needed, but local `id` and `name` are enough
// API returns: { success: true, data: { "Room Name": { ... }, ... } }

async function loadRooms() {
  try {
    const response = await fetch('https://api.tools.gavago.fr/socketio/api/rooms');
    const data = await response.json();

    if (data.success && data.data) {
      // Map API object to Room array
      // API uses room name as key. We don't have explicit IDs, so we'll use name as ID for consistency or generate one.
      // But socket join likely uses the room name. Let's use name as ID for now to be safe with existing logic which passes ID.
      rooms.value = Object.keys(data.data).map(key => ({
        id: key, // Use name as ID
        name: key,
        description: `Salon ${key}`, // API doesn't seem to have description
        createdAt: Date.now() // Fake date
      }));
      
      // Save to localStorage so RoomPage can access it
      localStorage.setItem('pwa_rooms', JSON.stringify(rooms.value));
    }
  } catch (err) {
    console.error('Erreur chargement salles:', err);
    // Fallback to local if needed, or show error. For now, we prefer to show nothing/error than stale local data if context is online.
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

  // Use the name as ID to match API behavior where keys are names
  const room: Room = {
    id: newRoomName.value, 
    name: newRoomName.value,
    description: newRoomDesc.value,
    createdAt: Date.now()
  };

  rooms.value.push(room);
  
  // Save to local storage so RoomPage can find it
  saveRooms();

  newRoomName.value = '';
  newRoomDesc.value = '';
  showCreateRoom.value = false;
  
  sendNotification('Salle créée !', `La salle "${room.name}" a été ajoutée localement.`);
  
  // Directly join it
  joinRoom(room.id);
}

function deleteRoom(roomId: string) {
  if (confirm('Voulez-vous masquer cette salle localement ?')) {
    rooms.value = rooms.value.filter(r => r.id !== roomId);
    // saveRooms();
    
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

<style scoped src="~/assets/css/ReceptionPage.css"></style>
