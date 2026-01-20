<template>
  <div class="gallery-page">
    <header class="gallery-header">
      <button class="back-btn" @click="goBack">← Retour</button>
      <h1>🖼️ Galerie Photos</h1>
      <button v-if="gallery.length > 0" class="clear-btn" @click="clearGallery">
        🗑️ Tout effacer
      </button>
    </header>

    <div class="gallery-content">
      <div v-if="gallery.length === 0" class="empty-gallery">
        <div class="empty-icon">📷</div>
        <h2>Aucune photo</h2>
        <p>Les photos que vous prenez ou partagez dans les chats apparaîtront ici.</p>
        <button @click="goBack" class="back-to-rooms-btn">
          Retour aux salles
        </button>
      </div>

      <div v-else class="gallery-grid">
        <div 
          v-for="item in gallery" 
          :key="item.id" 
          class="gallery-item"
          @click="openImage(item)"
        >
          <img :src="item.data" :alt="`Photo ${item.id}`" />
          <div class="gallery-item-overlay">
            <div class="gallery-item-info">
              <span class="gallery-date">{{ formatDate(item.timestamp) }}</span>
              <span v-if="item.roomName" class="gallery-room">{{ item.roomName }}</span>
            </div>
            <button 
              class="delete-photo-btn" 
              @click.stop="deletePhoto(item.id)"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="selectedImage" class="image-modal" @click="closeImage">
      <div class="image-modal-content" @click.stop>
        <div class="image-modal-header">
          <div class="image-modal-info">
            <span class="modal-date">{{ formatDate(selectedImage.timestamp) }}</span>
            <span v-if="selectedImage.roomName" class="modal-room">
              De: {{ selectedImage.roomName }}
            </span>
          </div>
          <button class="close-modal-btn" @click="closeImage">✕</button>
        </div>
        <img :src="selectedImage.data" alt="Image agrandie" />
        <div class="image-modal-actions">
          <button @click="downloadImage(selectedImage)" class="download-btn">
            💾 Télécharger
          </button>
          <button @click="deletePhoto(selectedImage.id)" class="delete-btn">
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';

interface GalleryItem {
  id: string;
  data: string;
  timestamp: number;
  roomId?: string;
  roomName?: string;
}

const navigate = inject<(to: string) => void>('navigate');

const gallery = ref<GalleryItem[]>([]);
const selectedImage = ref<GalleryItem | null>(null);

onMounted(() => {
  loadGallery();
});

function loadGallery() {
  const stored = localStorage.getItem('pwa_gallery');
  if (stored) {
    gallery.value = JSON.parse(stored);
    // Sort by newest first
    gallery.value.sort((a, b) => b.timestamp - a.timestamp);
  }
}

function saveGallery() {
  localStorage.setItem('pwa_gallery', JSON.stringify(gallery.value));
}

function openImage(item: GalleryItem) {
  selectedImage.value = item;
}

function closeImage() {
  selectedImage.value = null;
}

function deletePhoto(photoId: string) {
  if (confirm('Voulez-vous vraiment supprimer cette photo ?')) {
    gallery.value = gallery.value.filter(item => item.id !== photoId);
    saveGallery();
    
    if (selectedImage.value?.id === photoId) {
      closeImage();
    }

    sendNotification('Photo supprimée', 'La photo a été supprimée de la galerie.');
  }
}

function clearGallery() {
  if (confirm('Voulez-vous vraiment supprimer toutes les photos ?')) {
    gallery.value = [];
    localStorage.removeItem('pwa_gallery');
    sendNotification('Galerie effacée', 'Toutes les photos ont été supprimées.');
  }
}

function downloadImage(item: GalleryItem) {
  const link = document.createElement('a');
  link.href = item.data;
  link.download = `photo_${item.id}_${item.timestamp}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  sendNotification('Photo téléchargée', 'La photo a été téléchargée.');
}

function goBack() {
  if (navigate) navigate('reception');
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function sendNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192x192.png' });
  }
}
</script>

<style scoped src="~/assets/css/GalleryPage.css"></style>
