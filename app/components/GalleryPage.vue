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

<style scoped>
.gallery-page {
  min-height: 100vh;
  background: #f3f4f6;
}

.gallery-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  color: #fff;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gallery-header h1 {
  margin: 0;
  font-size: 1.5rem;
  flex: 1;
  text-align: center;
}

.back-btn, .clear-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.back-btn:hover, .clear-btn:hover {
  background: rgba(255,255,255,0.3);
}

.gallery-content {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.empty-gallery {
  text-align: center;
  padding: 4rem 1rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-gallery h2 {
  color: #374151;
  margin-bottom: 1rem;
}

.empty-gallery p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.back-to-rooms-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  color: #fff;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 0.6rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.back-to-rooms-btn:hover {
  transform: translateY(-2px);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.8rem;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.gallery-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.gallery-date, .gallery-room {
  color: #fff;
  font-size: 0.85rem;
}

.gallery-room {
  opacity: 0.9;
  font-size: 0.8rem;
}

.delete-photo-btn {
  background: rgba(220, 38, 38, 0.9);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.delete-photo-btn:hover {
  background: #dc2626;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.image-modal-content {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.image-modal-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.modal-date {
  font-size: 1rem;
  font-weight: 600;
}

.modal-room {
  font-size: 0.9rem;
  opacity: 0.8;
}

.close-modal-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 1.8rem;
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

.image-modal-content img {
  max-width: 100%;
  max-height: calc(90vh - 120px);
  border-radius: 0.8rem;
  object-fit: contain;
}

.image-modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.download-btn, .delete-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.download-btn {
  background: #10b981;
  color: #fff;
}

.delete-btn {
  background: #dc2626;
  color: #fff;
}

.download-btn:hover, .delete-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .gallery-header h1 {
    font-size: 1.2rem;
  }
}
</style>
