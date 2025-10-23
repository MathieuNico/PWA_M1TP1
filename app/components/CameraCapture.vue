<template>
  <div class="camera-modal" v-if="isOpen">
    <div class="camera-container">
      <div class="camera-header">
        <h3>📸 Capture Photo</h3>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="camera-viewport">
        <video v-if="!capturedImage" ref="videoRef" autoplay playsinline></video>
        <img v-else :src="capturedImage" alt="Captured" />
      </div>

      <div class="camera-controls">
        <button v-if="!capturedImage" @click="capturePhoto" class="capture-btn">
          📷 Capturer
        </button>
        <template v-else>
          <button @click="retake" class="retake-btn">🔄 Reprendre</button>
          <button @click="confirm" class="confirm-btn">✓ Valider</button>
        </template>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  capture: [imageData: string];
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const stream = ref<MediaStream | null>(null);
const capturedImage = ref<string | null>(null);
const error = ref('');

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    startCamera();
  } else {
    stopCamera();
  }
});

async function startCamera() {
  try {
    error.value = '';
    capturedImage.value = null;
    
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
    }
  } catch (err: any) {
    error.value = `Erreur caméra : ${err.message}`;
    console.error('Camera access error:', err);
  }
}

function capturePhoto() {
  if (!videoRef.value) return;

  const canvas = document.createElement('canvas');
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(videoRef.value, 0, 0);
    capturedImage.value = canvas.toDataURL('image/jpeg', 0.85);
    
    stopCamera();
  }
}

function retake() {
  capturedImage.value = null;
  startCamera();
}

function confirm() {
  if (capturedImage.value) {
    emit('capture', capturedImage.value);
    close();
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
}

function close() {
  stopCamera();
  capturedImage.value = null;
  error.value = '';
  emit('close');
}

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.camera-container {
  background: #fff;
  border-radius: 1.2rem;
  max-width: 600px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.camera-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.close-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.3);
}

.camera-viewport {
  width: 100%;
  aspect-ratio: 4/3;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.camera-viewport video,
.camera-viewport img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-controls {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  justify-content: center;
}

.camera-controls button {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.capture-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  flex: 1;
  max-width: 300px;
}

.retake-btn {
  background: #6b7280;
  color: #fff;
  flex: 1;
}

.confirm-btn {
  background: #10b981;
  color: #fff;
  flex: 1;
}

.camera-controls button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.error-message {
  color: #dc2626;
  text-align: center;
  padding: 0 1.5rem 1.5rem;
  margin: 0;
}

@media (max-width: 640px) {
  .camera-viewport {
    aspect-ratio: 3/4;
  }
}
</style>
