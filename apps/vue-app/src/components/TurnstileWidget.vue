<template>
  <div>
    <div ref="turnstileRef" class="cf-turnstile"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps({
  siteKey: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    default: 'download',
  },
});

const emit = defineEmits<{
  (e: 'verified', token: string): void;
  (e: 'error', error: string): void;
  (e: 'expired'): void;
}>();

const turnstileRef = ref<HTMLElement>();
let widgetId: string | null = null;

const loadTurnstile = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile script'));
    document.head.appendChild(script);
  });
};

const renderTurnstile = async () => {
  if (!turnstileRef.value) {
    console.error('Turnstile container not ready');
    return;
  }

  if (!window.turnstile) {
    console.error('Turnstile API not loaded');
    emit('error', 'Turnstile API not loaded');
    return;
  }

  const cleanSiteKey = props.siteKey?.trim();
  
  if (!cleanSiteKey || cleanSiteKey === 'undefined') {
    console.error('Invalid site key:', props.siteKey);
    emit('error', 'Invalid captcha site key');
    return;
  }

  try {
    // Give DOM a moment to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    widgetId = window.turnstile.render(turnstileRef.value, {
      sitekey: cleanSiteKey,
      callback: (token: string) => {
        console.log('Turnstile verified successfully');
        emit('verified', token);
      },
      'error-callback': (error: any) => {
        console.error('Turnstile verification error:', error);
        emit('error', 'Verification failed');
      },
      'expired-callback': () => {
        console.warn('Turnstile token expired');
        emit('expired');
      },
      action: props.action,
      theme: 'light',
      size: 'normal',
    });
    console.log('Turnstile widget rendered with ID:', widgetId);
  } catch (err) {
    console.error('Turnstile render error:', err);
    emit('error', `Failed to render captcha: ${err.message}`);
  }
};

onMounted(async () => {
  try {
    await loadTurnstile();
    await renderTurnstile();
  } catch (err) {
    console.error('Failed to initialize Turnstile:', err);
    emit('error', 'Failed to initialize captcha');
  }
});

onUnmounted(() => {
  if (widgetId && window.turnstile) {
    window.turnstile.remove(widgetId);
  }
});

// Watch for siteKey changes (shouldn't happen but defensive)
watch(() => props.siteKey, async () => {
  if (widgetId && window.turnstile) {
    window.turnstile.remove(widgetId);
  }
  await renderTurnstile();
});

// Expose reset method
const reset = () => {
  if (widgetId && window.turnstile) {
    window.turnstile.reset(widgetId);
  }
};

defineExpose({ reset });
</script>

<style scoped>
.cf-turnstile {
  display: flex;
  justify-content: center;
}
</style>
