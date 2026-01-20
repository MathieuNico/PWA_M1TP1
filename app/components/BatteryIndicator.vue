<template>
  <div class="battery-indicator" v-if="batterySupported">
    <span class="battery-icon" :style="{ color: batteryColor }">{{ batteryIcon }}</span>
    <span class="battery-text">{{ Math.round(batteryLevel * 100) }}%</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const batteryLevel = ref(1);
const isCharging = ref(false);
const batterySupported = ref(false);
let batteryManager: any = null;

const batteryColor = computed(() => {
  if (isCharging.value) return '#4ade80'; // Green while charging
  if (batteryLevel.value > 0.5) return '#fff'; // White usually (or based on theme)
  if (batteryLevel.value > 0.2) return '#facc15'; // Yellow
  return '#ef4444'; // Red
});

const batteryIcon = computed(() => {
  if (isCharging.value) return '⚡';
  if (batteryLevel.value > 0.9) return '🔋';
  return '🔋'; // Simplify for now, could use different icons
});

async function initBattery() {
  try {
    if ('getBattery' in navigator) {
      // @ts-ignore
      batteryManager = await navigator.getBattery();
      batterySupported.value = true;
      updateBatteryStatus();
      
      batteryManager.addEventListener('levelchange', updateBatteryStatus);
      batteryManager.addEventListener('chargingchange', updateBatteryStatus);
    }
  } catch (err) {
    console.error('Battery API error', err);
  }
}

function updateBatteryStatus() {
  if (batteryManager) {
    batteryLevel.value = batteryManager.level;
    isCharging.value = batteryManager.charging;
  }
}

onMounted(() => {
  initBattery();
});

onUnmounted(() => {
  if (batteryManager) {
    batteryManager.removeEventListener('levelchange', updateBatteryStatus);
    batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
  }
});
</script>

<style scoped src="~/assets/css/BatteryIndicator.css"></style>
