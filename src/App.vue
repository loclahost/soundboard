<script setup>
import SoundCard from './components/SoundCard.vue'

import { ref } from 'vue'

const sounds = ref([]);

fetch('api/get/sounds')
.then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  })
  .then(someJson => (sounds.value = someJson));
</script>

<template>
  <nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <span class="navbar-brand mb-0 h1">Team Telia Soundboard</span>
  </div>
</nav>
  <div class="container py-5">
  <ul class="sound-list">
    <li v-for="(sound, index) in sounds" :key="index" class="sound-card">
      <SoundCard :sound='sound'></SoundCard>
    </li>
  </ul>
  </div>
</template>

<style scoped>
.sound-list {
  list-style: none;
}
.sound-card {
  width: 10rem;
  height: 10rem;
}
</style>
