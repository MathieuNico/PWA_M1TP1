<template>
  <div class="room-page">
    <header class="room-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">←</button>
        <div class="room-title">
          <h1>{{ currentRoom?.name || 'Salle' }}</h1>
          <p>{{ currentRoom?.description }}</p>
        </div>
      </div>
      <div class="header-right">
        <button class="call-btn" @click="makeRoomCall" title="Appeler la salle">📞</button>
        <BatteryIndicator />
      </div>
    </header>

    <div class="chat-container">
      <div class="messages-area" ref="messagesArea">
        <div v-if="messages.length === 0" class="empty-chat">
          <p>Aucun message. Commencez la conversation !</p>
        </div>

        <div 
          v-for="message in messages" 
          :key="message.id" 
          :class="['message', { 'own-message': message.userId === user?.username }]"
        >
          <div class="message-header">
            <img 
              v-if="message.avatar" 
              :src="message.avatar" 
              class="message-avatar" 
              alt="Avatar" 
            />
            <span class="message-username">{{ message.username }}</span>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
          
          <div class="message-content">
            <p v-if="message.text">{{ message.text }}</p>
            <img 
              v-if="message.image" 
              :src="message.image" 
              class="message-image" 
              alt="Image"
              @click="openImage(message.image)"
            />
          </div>
        </div>
      </div>

      <div class="input-area">
        <button @click="openCamera" class="camera-btn" title="Prendre une photo">
          📷
        </button>
        <input 
          v-model="messageText" 
          type="text" 
          placeholder="Écrivez votre message..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" class="send-btn">
          Envoyer →
        </button>
      </div>
    </div>

    <!-- Camera Component -->
    <CameraCapture 
      :isOpen="cameraOpen" 
      @close="cameraOpen = false" 
      @capture="onPhotoCapture"
    />

    <!-- Image Viewer Modal -->
    <div v-if="viewingImage" class="image-modal" @click="viewingImage = null">
      <div class="image-modal-content">
        <img :src="viewingImage" alt="Image agrandie" />
        <button class="close-modal-btn" @click="viewingImage = null">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, computed, nextTick, watch } from 'vue';
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
}

interface Message {
  id: string;
  username: string;
  userId: string;
  avatar?: string;
  text?: string;
  image?: string;
  timestamp: number;
}

const navigate = inject<(to: string, params?: any) => void>('navigate');
const currentRoomId = inject<{ value: string | null }>('currentRoomId');

const user = ref<User | null>(null);
const currentRoom = ref<Room | null>(null);
const messages = ref<Message[]>([]);
const messageText = ref('');
const cameraOpen = ref(false);
const viewingImage = ref<string | null>(null);
const messagesArea = ref<HTMLDivElement | null>(null);

onMounted(() => {
  loadUser();
  loadRoom();
  loadMessages();
  scrollToBottom();
});

watch(() => messages.value.length, () => {
  nextTick(() => scrollToBottom());
});

function loadUser() {
  const stored = localStorage.getItem('pwa_user');
  if (stored) {
    user.value = JSON.parse(stored);
  } else {
    // Redirect to reception if not logged in
    if (navigate) navigate('reception');
  }
}

function loadRoom() {
  if (!currentRoomId?.value) {
    if (navigate) navigate('reception');
    return;
  }

  const rooms = JSON.parse(localStorage.getItem('pwa_rooms') || '[]');
  currentRoom.value = rooms.find((r: Room) => r.id === currentRoomId.value) || null;

  if (!currentRoom.value && navigate) {
    navigate('reception');
  }
}

function loadMessages() {
  if (!currentRoomId?.value) return;

  const stored = localStorage.getItem(`pwa_messages_${currentRoomId.value}`);
  if (stored) {
    messages.value = JSON.parse(stored);
  }
}

function saveMessages() {
  if (!currentRoomId?.value) return;
  localStorage.setItem(`pwa_messages_${currentRoomId.value}`, JSON.stringify(messages.value));
}

function sendMessage() {
  if (!messageText.value.trim() || !user.value) return;

  const message: Message = {
    id: `msg_${Date.now()}`,
    username: user.value.username,
    userId: user.value.username,
    avatar: user.value.avatar,
    text: messageText.value,
    timestamp: Date.now()
  };

  messages.value.push(message);
  saveMessages();
  messageText.value = '';

  sendNotification('Nouveau message', `${user.value.username}: ${message.text}`);
}

// Watch for new messages to trigger vibration (simulated for demonstration)
watch(() => messages.value.length, (newVal, oldVal) => {
  if (newVal > oldVal) {
    const lastMsg = messages.value[messages.value.length - 1];
    // Vibrate only if it's not our own message (simulated check, here we vibrate for all new additions to show it works)
    // In a real app, we check if lastMsg.userId !== user.value.username
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
  }
});

function makeRoomCall() {
  if (confirm(`Voulez-vous lancer un appel dans ${currentRoom.value?.name} ?`)) {
    // Simulate call
    alert('Appel en cours... (Simulation)');
  }
}

function openCamera() {
  cameraOpen.value = true;
}

function onPhotoCapture(imageData: string) {
  if (!user.value) return;

  // Save to gallery
  saveToGallery(imageData);

  // Send as message
  const message: Message = {
    id: `msg_${Date.now()}`,
    username: user.value.username,
    userId: user.value.username,
    avatar: user.value.avatar,
    image: imageData,
    timestamp: Date.now()
  };

  messages.value.push(message);
  saveMessages();

  sendNotification('Photo partagée !', `${user.value.username} a partagé une photo.`);
}

function saveToGallery(imageData: string) {
  const gallery = JSON.parse(localStorage.getItem('pwa_gallery') || '[]');
  gallery.push({
    id: `img_${Date.now()}`,
    data: imageData,
    timestamp: Date.now(),
    roomId: currentRoomId?.value,
    roomName: currentRoom.value?.name
  });
  localStorage.setItem('pwa_gallery', JSON.stringify(gallery));
}

function openImage(imageUrl: string) {
  viewingImage.value = imageUrl;
}

function scrollToBottom() {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight;
  }
}

function goBack() {
  if (navigate) navigate('reception');
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function sendNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192x192.png' });
  }
}
</script>

<style scoped>
.room-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
}

.room-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.call-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  color: #fff;
  transition: background 0.2s;
}

.call-btn:hover {
  background: #10b981;
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

.room-title h1 {
  margin: 0;
  font-size: 1.5rem;
}

.room-title p {
  margin: 0.2rem 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  height: calc(100vh - 80px);
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-chat {
  text-align: center;
  color: #9ca3af;
  padding: 3rem 1rem;
  font-size: 1.1rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  align-self: flex-start;
  animation: slideIn 0.3s ease;
}

.own-message {
  align-self: flex-end;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
}

.message-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.message-username {
  font-weight: 600;
  color: #667eea;
}

.message-time {
  color: #9ca3af;
  font-size: 0.8rem;
  margin-left: auto;
}

.message-content {
  background: #fff;
  border-radius: 0.8rem;
  padding: 0.8rem 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.own-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.own-message .message-username {
  color: #764ba2;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-image {
  max-width: 100%;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  display: block;
  margin-top: 0.5rem;
}

.message-image:hover {
  transform: scale(1.02);
}

.input-area {
  background: #fff;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
}

.camera-btn {
  background: #667eea;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
}

.camera-btn:hover {
  background: #5568d3;
  transform: scale(1.05);
}

.input-area input {
  flex: 1;
  padding: 0.9rem 1.2rem;
  border: 1px solid #d1d5db;
  border-radius: 0.6rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.input-area input:focus {
  border-color: #667eea;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  padding: 0.9rem 1.5rem;
  border-radius: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  white-space: nowrap;
}

.send-btn:hover {
  transform: translateY(-2px);
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 0.8rem;
}

.close-modal-btn {
  position: absolute;
  top: -3rem;
  right: 0;
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-modal-btn:hover {
  background: rgba(255,255,255,0.3);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .message {
    max-width: 85%;
  }
  
  .input-area {
    padding: 0.8rem 1rem;
  }
}
</style>
