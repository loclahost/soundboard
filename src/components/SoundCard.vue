<script setup>

defineProps({sound:String})

function playSound(sound) {
  fetch('api/play/sound/' + sound);
}

</script>

<template>
  <div class="card" @click="playSound(sound)">
    <img :src='"/api/get/cover/" + sound' class="card-img-top">
  </div>
</template>

<style scoped>
.sound-image {
  width: 100%;
  height: 100%;
}
</style>
