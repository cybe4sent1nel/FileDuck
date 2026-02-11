<template>
  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
    <div class="flex-1 mr-4">
      <label class="text-sm font-medium text-gray-700 flex items-center">
        <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Require CAPTCHA for downloads
        <span v-if="isAutoEnabled" class="ml-2 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Auto-Enabled</span>
      </label>
      <p class="text-xs text-gray-500 mt-1">
        <span v-if="isAutoEnabled">
          🛡️ CAPTCHA automatically enabled for files larger than 50MB for security. You can disable if needed.
        </span>
        <span v-else-if="modelValue">
          CAPTCHA enabled - Recipients must verify before download
        </span>
        <span v-else>
          Add extra security for sensitive files
        </span>
      </p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="sr-only peer"
      >
      <div class="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-16 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95">
        <svg class="absolute top-1 left-8 stroke-gray-900 w-6 h-6" height="100" viewBox="0 0 100 100" width="100">
          <path class="svg-fill-primary" d="M50,18A19.9,19.9,0,0,0,30,38v8a8,8,0,0,0-8,8V74a8,8,0,0,0,8,8H70a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H38V38a12,12,0,0,1,23.6-3,4,4,0,1,0,7.8-2A20.1,20.1,0,0,0,50,18Z" />
        </svg>
        <svg class="absolute top-1 left-1 stroke-gray-900 w-6 h-6" height="100" viewBox="0 0 100 100" width="100">
          <path d="M30,46V38a20,20,0,0,1,40,0v8a8,8,0,0,1,8,8V74a8,8,0,0,1-8,8H30a8,8,0,0,1-8-8V54A8,8,0,0,1,30,46Zm32-8v8H38V38a12,12,0,0,1,24,0Z" fill-rule="evenodd" />
        </svg>
      </div>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  isAutoEnabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>
