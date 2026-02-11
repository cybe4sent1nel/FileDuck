<template>
  <div class="scanning-wrapper">
    <!-- The Curved Track Container -->
    <div class="track-container">
      <div v-for="(item, index) in activeItems" 
           :key="item.id" 
           class="track-item"
           :style="getItemStyle(item)"
           :ref="el => setItemRef(el, index)">
           
        <!-- Dynamic Content Switching -->
        <div class="icon-wrapper"
             :class="item.processed ? 'scale-110' : ''">
          
          <!-- BEFORE PROCESSING (Raw File) -->
          <div v-if="!item.processed" class="flex flex-col items-center gap-1">
            <component 
              :is="getIconComponent(item.icon)" 
              :size="28" 
              :stroke-width="2"
              :class="item.infected ? 'text-red-400' : 'text-gray-400'">
            </component>
            <span class="file-ext">{{ item.ext }}</span>
          </div>

          <!-- AFTER PROCESSING (Result) -->
          <div v-else class="flex flex-col items-center gap-1">
            <!-- Infected Result -->
            <div v-if="item.infected" class="flex flex-col items-center gap-1">
              <ShieldAlertIcon :size="28" :stroke-width="2" class="text-red-500" />
              <span class="file-ext text-red-500">BLOCKED</span>
            </div>
            <!-- Safe Result -->
            <div v-else class="flex flex-col items-center gap-1">
              <LockIcon :size="28" :stroke-width="2" class="text-emerald-500" />
              <span class="file-ext text-emerald-500">SECURE</span>
            </div>
          </div>
        </div>

        <!-- Separator '✦' -->
        <span class="separator">✦</span>
      </div>
    </div>

    <!-- Central Badge -->
    <div class="pill" :class="statusClasses" ref="pillRef">
      <div class="scanner-line" :class="{ active: currentStatus === 'scanning' }"></div>
      
      <div class="content-layer">
        <div class="flex items-center gap-3">
          <component :is="badgeIconComponent" :size="24" :stroke-width="2.5" :class="iconColorClass" />
          
          <div class="flex gap-1 h-6 overflow-hidden transition-opacity duration-500" 
               :class="currentStatus === 'danger' ? 'opacity-0' : 'opacity-100'">
            <div class="binary-column" v-for="col in 3" :key="col">
              <span>1</span><span>0</span><span>1</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end">
          <span class="badge-text" :class="textColorClass">
            {{ badgeText }}
          </span>
          <span class="badge-subtext">
            {{ subText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  FileTextIcon, 
  FileWarningIcon, 
  ImageIcon, 
  FileCodeIcon, 
  FileVideoIcon, 
  FileX2Icon, 
  FilePieChartIcon, 
  MusicIcon,
  ShieldAlertIcon,
  LockIcon,
  CheckCircleIcon,
  ScanSearchIcon
} from 'lucide-vue-next';

// Configuration
const rawItems = [
  { icon: 'file-text', ext: '.DOCX', infected: false },
  { icon: 'file-warning', ext: '.EXE', infected: true },
  { icon: 'image', ext: '.RAW', infected: false },
  { icon: 'file-code', ext: '.TSX', infected: false },
  { icon: 'file-video', ext: '.MOV', infected: false },
  { icon: 'file-x-2', ext: '.BAT', infected: true },
  { icon: 'file-pie-chart', ext: '.PDF', infected: false },
  { icon: 'music', ext: '.FLAC', infected: false },
];

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'file-text': FileTextIcon,
    'file-warning': FileWarningIcon,
    'image': ImageIcon,
    'file-code': FileCodeIcon,
    'file-video': FileVideoIcon,
    'file-x-2': FileX2Icon,
    'file-pie-chart': FilePieChartIcon,
    'music': MusicIcon,
  };
  return iconMap[iconName] || FileTextIcon;
};

// Generate enough items to fill the curve seamlessly
const activeItems = ref<any[]>([]);
const itemCount = 10;
const animationDuration = 20;

for(let i = 0; i < itemCount; i++) {
  const baseItem = rawItems[i % rawItems.length];
  activeItems.value.push({
    ...baseItem,
    id: i,
    processed: false,
    progress: (i / itemCount)
  });
}

// Curve Path Logic
const pillRef = ref<HTMLElement | null>(null);
const itemRefs = ref<(HTMLElement | null)[]>([]);

const getItemStyle = (item: any) => {
  const animationDelay = -(item.progress * animationDuration);
  return {
    animationDelay: `${animationDelay}s`
  };
};

const setItemRef = (el: any, index: number) => {
  itemRefs.value[index] = el;
};

// Detection & Transformation State
const currentStatus = ref<'scanning' | 'danger' | 'safe'>('scanning');

// Animation Loop
let animationFrameId: number;
let lastUpdate = 0;

const detectCollisions = (timestamp: number) => {
  if (!pillRef.value) {
    animationFrameId = requestAnimationFrame(detectCollisions);
    return;
  }
  
  // Throttle to 60fps
  if (timestamp - lastUpdate < 16) {
    animationFrameId = requestAnimationFrame(detectCollisions);
    return;
  }
  lastUpdate = timestamp;

  const pillRect = pillRef.value.getBoundingClientRect();
  const pillCenter = pillRect.left + pillRect.width / 2;
  const threshold = 80;

  let hasInfectedNearby = false;
  let hasSafeNearby = false;

  itemRefs.value.forEach((el, index) => {
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const dist = Math.abs(itemCenter - pillCenter);
    const item = activeItems.value[index];

    // Reset when off screen left
    if (rect.left < -100) {
      item.processed = false;
    }

    // Trigger Zone
    if (dist < threshold) {
      if (!item.processed) {
        item.processed = true;
      }
      
      if (item.infected) {
        hasInfectedNearby = true;
      } else {
        hasSafeNearby = true;
      }
    }
  });

  if (hasInfectedNearby) {
    currentStatus.value = 'danger';
  } else if (hasSafeNearby) {
    currentStatus.value = 'safe';
  } else {
    currentStatus.value = 'scanning';
  }

  animationFrameId = requestAnimationFrame(detectCollisions);
};

onMounted(() => {
  animationFrameId = requestAnimationFrame(detectCollisions);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});

// Computed for Badge UI
const badgeText = computed(() => {
  if (currentStatus.value === 'danger') return 'BLOCKED';
  if (currentStatus.value === 'safe') return 'ENCRYPTED';
  return 'SCANNING';
});

const subText = computed(() => {
  if (currentStatus.value === 'danger') return 'MALWARE DETECTED';
  if (currentStatus.value === 'safe') return 'VERIFIED SAFE';
  return 'ANALYZING FILE';
});

const badgeIconComponent = computed(() => {
  if (currentStatus.value === 'danger') return ShieldAlertIcon;
  if (currentStatus.value === 'safe') return CheckCircleIcon;
  return ScanSearchIcon;
});

const statusClasses = computed(() => ({
  'state-danger': currentStatus.value === 'danger',
  'state-safe': currentStatus.value === 'safe',
  'border-gray-800': currentStatus.value === 'scanning'
}));

const textColorClass = computed(() => {
  if (currentStatus.value === 'danger') return 'text-red-600';
  if (currentStatus.value === 'safe') return 'text-emerald-600';
  return 'text-black';
});

const iconColorClass = computed(() => {
  if (currentStatus.value === 'danger') return 'text-red-600';
  if (currentStatus.value === 'safe') return 'text-emerald-600';
  return 'text-black';
});
</script>

<style scoped>
.scanning-wrapper {
  position: relative;
  width: 100vw;
  height: 200px;
  margin-left: calc(-50vw + 50%);
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}

.track-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

@keyframes follow-curve {
  0% {
    offset-distance: -5%;
    opacity: 0;
  }
  2% {
    opacity: 1;
  }
  98% {
    opacity: 1;
  }
  100% {
    offset-distance: 105%;
    opacity: 0;
  }
}

.track-item {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  offset-path: path('M -500 170 Q 960 30 2420 170');
  offset-rotate: 0deg;
  animation: follow-curve 20s linear infinite;
  will-change: offset-distance;
}

.icon-wrapper {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.file-ext {
  font-size: 10px;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.separator {
  color: #d1d5db;
  font-size: 1.25rem;
  animation: spin-slow 6s linear infinite;
  opacity: 0.5;
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pill {
  position: relative;
  z-index: 30;
  background: #FFFFFF;
  border: 3px solid #1a1a1a;
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.pill.state-danger {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  box-shadow: 0 20px 60px rgba(239, 68, 68, 0.25);
}

.pill.state-safe {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.25);
}

@keyframes scan-sweep {
  0% { left: -10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 110%; opacity: 0; }
}

.scanner-line {
  position: absolute;
  top: 0;
  left: -10%;
  width: 6px;
  height: 100%;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(6, 182, 212, 0.3) 20%,
    rgba(20, 184, 166, 0.9) 50%, 
    rgba(6, 182, 212, 0.3) 80%,
    transparent 100%);
  box-shadow: 
    0 0 20px 8px rgba(20, 184, 166, 0.6),
    0 0 40px 12px rgba(6, 182, 212, 0.4),
    inset 0 0 10px 2px rgba(255, 255, 255, 0.8);
  animation: scan-sweep 2.5s ease-in-out infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 9999px;
}

.scanner-line.active {
  opacity: 1;
}

.binary-column {
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', monospace;
  font-size: 9px;
  line-height: 9px;
  font-weight: bold;
  color: #1a1a1a;
  opacity: 0.4;
}

.content-layer {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.badge-text {
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: -0.02em;
  font-family: 'Courier New', monospace;
  transition: color 0.4s ease;
}

.badge-subtext {
  font-size: 9px;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.4s ease;
}
</style>
