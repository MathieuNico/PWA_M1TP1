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

<style scoped src="~/assets/css/CameraCapture.css"></style>
