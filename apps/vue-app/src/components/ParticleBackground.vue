<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <!-- Floating particles -->
    <div v-for="i in 20" :key="i" 
         :class="`particle particle-${i}`"
         :style="{
           left: `${Math.random() * 100}%`,
           top: `${Math.random() * 100}%`,
           animationDelay: `${Math.random() * 5}s`,
           animationDuration: `${15 + Math.random() * 10}s`
         }">
    </div>
  </div>
</template>

<style scoped>
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9333ea, #eab308);
  opacity: 0.3;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0) scale(0.5);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) translateX(50px) scale(1);
    opacity: 0;
  }
}

.particle:nth-child(even) {
  background: linear-gradient(135deg, #eab308, #9333ea);
  animation-direction: reverse;
}

.particle:nth-child(3n) {
  width: 4px;
  height: 4px;
}

.particle:nth-child(5n) {
  width: 8px;
  height: 8px;
}
</style>
