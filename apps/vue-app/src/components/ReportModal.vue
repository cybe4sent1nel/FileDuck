<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div class="relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-2xl border-4 border-purple-200">
        <!-- Header -->
        <div class="p-6 border-b border-purple-100 flex items-center justify-between bg-purple-50/50">
          <h2 class="text-2xl font-bold text-gray-800">Report a Problem</h2>
          <button @click="$emit('close')" class="p-2 text-gray-500 hover:text-purple-600 transition-colors bg-white rounded-full shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitReport" class="p-8 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select v-model="form.category" class="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all appearance-none bg-white text-gray-900">
              <option value="bug" class="text-gray-900">Bug Report</option>
              <option value="ui" class="text-gray-900">UI/UX Issue</option>
              <option value="performance" class="text-gray-900">Performance</option>
              <option value="feature" class="text-gray-900">Feature Request</option>
              <option value="other" class="text-gray-900">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Summary</label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="Briefly describe the issue..." 
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
            <textarea 
              v-model="form.description" 
              rows="4" 
              placeholder="Tell us more about what happened..." 
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white resize-none"
            ></textarea>
          </div>

          <div class="flex gap-4 pt-2">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="submitting"
              class="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
              <span v-if="submitting" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Reporting...
              </span>
              <span v-else>Submit Report</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Success Notification Toast -->
      <Transition name="fade">
        <div v-if="showSuccess" class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up z-[110]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="font-bold">Issue reported successfully!</span>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const submitting = ref(false);
const showSuccess = ref(false);

const form = reactive({
  title: '',
  description: '',
  category: 'bug',
});

const submitReport = async () => {
  submitting.value = true;
  try {
    const apiBase = import.meta.env.VITE_API_URL || '';
    const reportUrl = apiBase ? `${apiBase}/api/report-issue` : '/api/report-issue';

    const response = await fetch(reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        email: 'user-via-status-page', // Can be enhanced later
      }),
    });

    if (!response.ok) throw new Error('Failed to submit report');

    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
      emit('close');
      // Reset form
      form.title = '';
      form.description = '';
    }, 2000);
  } catch (error) {
    console.error('Error reporting:', error);
    alert('Failed to report issue. Please try again later.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .rounded-3xl, .modal-leave-active .rounded-3xl {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .rounded-3xl, .modal-leave-to .rounded-3xl {
  transform: scale(0.9) translateY(20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes slide-up {
  from { transform: translate(-50%, 40px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>

