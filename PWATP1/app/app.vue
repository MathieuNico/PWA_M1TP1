


<template>
  <Navbar :selected="selected" @select="selected = $event" />
  <div v-if="selected === 'profil'">
    <ProfilePage />
  </div>
  <div v-else>
    <LoginPage />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const selected = ref('profil');
</script>
