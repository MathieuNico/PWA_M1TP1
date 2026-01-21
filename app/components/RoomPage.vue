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
        <button @click="triggerFileUpload" class="attach-btn" title="Envoyer une image">
          📎
        </button>
        <button @click="shareLocation" class="location-btn" title="Partager ma position">
          📍
        </button>
        <input 
          type="file" 
          ref="fileInput" 
          accept="image/*" 
          class="hidden-file-input" 
          @change="handleFileUpload"
        />
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

const { $socket } = useNuxtApp();
const user = ref<User | null>(null);
const currentRoom = ref<Room | null>(null);
const messages = ref<Message[]>([]);
const messageText = ref('');
const cameraOpen = ref(false);
const viewingImage = ref<string | null>(null);
const messagesArea = ref<HTMLDivElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const joinTime = Date.now();

onMounted(() => {
  loadUser();
  loadRoom();
  loadMessages();
  scrollToBottom();

  if ($socket) {
    if (!$socket.connected) {
      $socket.connect();
    }
    
    // Listen for incoming messages
    // Event: 'chat-msg'
    // Payload: { content, dateEmis, roomName, categorie, userId, serverId }
    
    $socket.on('chat-msg', (data: any) => {
      console.log('Socket message received:', data);
      handleIncomingMessage(data);
      
      // Unified notification logic
      const sender = data.pseudo || data.userId || 'Anonyme';
      const msgTime = new Date(data.dateEmis || Date.now()).getTime();

      // Only notify for messages received AFTER joining
      if (sender !== user.value?.username && sender !== 'SERVER' && msgTime > joinTime) {
          let body = data.content;
          if (typeof body === 'object') body = body.description || 'Fichier joint';
          if (data.categorie === 'NEW_IMAGE' || (typeof body === 'string' && body.startsWith('data:image'))) {
              body = 'Image partagée';
          }
          sendNotification(`Nouveau message de ${sender}`, body);
      }
    });

    $socket.on('chat-joined-room', (data: any) => {
        console.log('Socket joined room:', data);
    });

     $socket.on('connect', () => {
      console.log('Connected to Socket.IO server', $socket.id);
      joinSocketRoom();
    });
    
    // Also try to join immediately if already connected
    if ($socket.connected) {
       joinSocketRoom();
    }
  }

  // Load history from API
  fetchHistory();
});

onUnmounted(() => {
    if ($socket) {
        $socket.off('chat-msg');
        $socket.off('chat-joined-room');
        $socket.off('connect');
    }
});

function joinSocketRoom() {
    if (currentRoom.value && user.value) {
           console.log(`Joining room ${currentRoom.value.id}`);
           // Event: 'chat-join-room'
           // Payload: { pseudo, myPseudo, roomName } - Reference sends both pseudo keys
           $socket.emit('chat-join-room', { 
               roomName: currentRoom.value.id, 
               pseudo: user.value.username,
               myPseudo: user.value.username 
           });
    }
}

function handleIncomingMessage(data: any) {
    try {
        const msg = data;
        const sender = msg.pseudo || msg.userId || 'Anonyme';
        
        let content = typeof msg.content === 'object' ? msg.content.description : msg.content;
        const isImage = msg.categorie === 'NEW_IMAGE' || (typeof content === 'string' && content.startsWith('data:image'));
        
        const newMessage: Message = {
            id: msg.id || `msg_${Date.now()}_${Math.random()}`, 
            username: sender, 
            userId: sender,
            text: isImage ? undefined : content,
            image: isImage ? content : undefined,
            timestamp: new Date(msg.dateEmis || Date.now()).getTime(),
            avatar: undefined
        };

        // Check for duplicates
        const isDuplicate = messages.value.some(m => {
             const sameContent = isImage ? (m.image === content) : (m.text === content);
             const sameUser = m.userId === sender;
             const recent = Math.abs(m.timestamp - newMessage.timestamp) < 10000;
             return sameContent && sameUser && recent;
        });

        const isOwnMessage = sender === user.value?.username;

        if (!isDuplicate && !isOwnMessage) {
             messages.value.push(newMessage);
             scrollToBottom();
             
             // Vibrate on new message (if not own)
             if (navigator.vibrate) {
                navigator.vibrate(200);
             }
        } else {
            console.log('Ignored duplicate or own message:', content);
        }
    } catch(e) {
        console.error('Error parsing incoming message', e);
    }
}

// Restoration of methods that were accidentally removed
function loadUser() {
  const stored = localStorage.getItem('pwa_user');
  if (stored) {
    user.value = JSON.parse(stored);
  } else {
    // Redirect to reception if not logged in
    if (navigate) navigate('reception');
  }
}

async function fetchHistory() {
  if (!currentRoomId?.value) return;
  
  try {
    const response = await fetch('https://api.tools.gavago.fr/socketio/api/rooms');
    const data = await response.json();
    
    if (data.success && data.data && data.data[currentRoomId.value]) {
      const apiConversations = data.data[currentRoomId.value].conversations || [];
      
      // Map API format to local format
      const historyMessages: Message[] = apiConversations
        .filter((msg: any) => msg.categorie === 'MESSAGE' || msg.categorie === 'NEW_IMAGE')
        .map((msg: any) => {
          const isImage = msg.categorie === 'NEW_IMAGE' || (typeof msg.content === 'string' && msg.content.startsWith('data:image'));
          return {
            id: `hist_${msg.dateEmis}_${Math.random()}`,
            username: msg.pseudo || 'Anonyme',
            userId: msg.pseudo,
            text: isImage ? undefined : msg.content,
            image: isImage ? msg.content : undefined,
            timestamp: new Date(msg.dateEmis).getTime(),
            avatar: undefined
          };
        });

      // Merge history with existing messages
      const existing = [...messages.value];
      
      historyMessages.forEach(histMsg => {
        const isDuplicate = existing.some(m => {
          const sameContent = histMsg.image ? (m.image === histMsg.image) : (m.text === histMsg.text);
          const sameUser = m.userId === histMsg.userId;
          const sameTime = Math.abs(m.timestamp - histMsg.timestamp) < 10000;
          return sameContent && sameUser && sameTime;
        });
        
        if (!isDuplicate) {
          existing.push(histMsg);
        }
      });

      // Sort by timestamp guaranteed
      messages.value = existing.sort((a, b) => a.timestamp - b.timestamp);
      saveMessages();
      scrollToBottom();
    }
  } catch (err) {
    console.error('Erreur récupération historique:', err);
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

  const text = messageText.value;
  
  const message: Message = {
    id: `msg_${Date.now()}`,
    username: user.value.username,
    userId: user.value.username,
    avatar: user.value.avatar,
    text: text,
    timestamp: Date.now()
  };

  // Send via Socket
  // Event: 'chat-msg'
  // Payload: { content, roomName }
  if (currentRoom.value) {
      $socket.emit('chat-msg', { 
          content: text,
          roomName: currentRoom.value.id
      });
  }

  // Optimistic update
  messages.value.push(message);
  saveMessages();
  messageText.value = '';

  sendNotification('Nouveau message', `${user.value.username}: ${text}`);
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

function triggerFileUpload() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const imageData = e.target?.result as string;
    if (imageData) {
      onPhotoCapture(imageData);
    }
  };
  reader.readAsDataURL(file);
  
  // Reset input
  target.value = '';
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

  if (currentRoom.value) {
      $socket.emit('chat-msg', { 
          content: imageData,
          roomName: currentRoom.value.id,
          categorie: 'NEW_IMAGE'
      });
  }

  messages.value.push(message);
  saveMessages();

  sendNotification('Photo partagée !', `${user.value.username} a partagé une photo.`);
}

function shareLocation() {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const messageText = `Ma position actuelle : ${mapsUrl}`;
      
      // We can't directly call sendMessage because it uses the ref messageText
      // So we implement a simplified send logic here
      if (!user.value || !currentRoom.value) return;

      const message: Message = {
        id: `msg_${Date.now()}`,
        username: user.value.username,
        userId: user.value.username,
        avatar: user.value.avatar,
        text: messageText,
        timestamp: Date.now()
      };

      $socket.emit('chat-msg', { 
          content: messageText,
          roomName: currentRoom.value.id
      });

      messages.value.push(message);
      saveMessages();
      scrollToBottom();
      
      sendNotification('Position partagée', `${user.value.username} a partagé sa position.`);
    },
    (error) => {
      console.error("Erreur de géolocalisation:", error);
      alert("Impossible de récupérer votre position.");
    }
  );
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
  console.log("Tentative d'envoi de notification:", title, body);
  if (!('Notification' in window)) {
    console.warn('Les notifications ne sont pas supportées par ce navigateur.');
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192x192.png' });
  } else {
    console.warn('Permission de notification non accordée:', Notification.permission);
  }
}
</script>

<style scoped src="~/assets/css/RoomPage.css"></style>
