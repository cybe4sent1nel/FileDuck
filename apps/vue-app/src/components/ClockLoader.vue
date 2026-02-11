<template>
  <div class="loader">
    <span class="hour"></span>
    <span class="min"></span>
    <span class="circel"></span>
  </div>
</template>

<script setup lang="ts">
// Clock loader component - animated clock indicating time/expiry
</script>

<style scoped>
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #22c55ea6;
  border-radius: 50px;
  position: relative;
  display: inline-block;
}

.loader span {
  display: block;
  background: #22c55e;
}

.loader .hour,
.loader .min {
  width: 2px;
  height: 7px;
  border-radius: 50px;
  position: absolute;
  top: 7.5px;
  left: 7px;
  animation: load9243 1.2s linear infinite;
  transform-origin: top center;
}

.loader .min {
  height: 5px;
  animation: load9243 4s linear infinite;
}

.loader .circel {
  width: 3px;
  height: 3px;
  border-radius: 50px;
  position: absolute;
  top: 6px;
  left: 6.5px;
}

@keyframes load9243 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
