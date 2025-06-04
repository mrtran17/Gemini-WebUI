<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100">Gửi Góp ý</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <font-awesome-icon icon="times" class="text-lg" />
        </button>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label for="feedback-title" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tiêu đề</label>
          <input
            type="text"
            id="feedback-title"
            v-model="feedback.title"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
            placeholder="Nhập tiêu đề góp ý"
          />
        </div>
        <div>
          <label for="feedback-description" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Mô tả</label>
          <textarea
            id="feedback-description"
            v-model="feedback.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
            placeholder="Nhập mô tả chi tiết góp ý của bạn"
          ></textarea>
        </div>
        <div>
          <label for="feedback-image" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Hình ảnh (URL)</label>
          <input
            type="url"
            id="feedback-image"
            v-model="feedback.image"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
            placeholder="URL hình ảnh (tùy chọn)"
          />
        </div>
        <div>
          <label for="feedback-email" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
          <input
            type="email"
            id="feedback-email"
            v-model="feedback.email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
            placeholder="Nhập email của bạn"
          />
        </div>
      </div>
      <div class="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
        >
          Hủy
        </button>
        <button
          @click="submitFeedback"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Gửi Góp ý
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'submitFeedback']);

const feedback = ref({
  title: '',
  description: '',
  image: '',
  email: '',
});

// Reset feedback form when modal is opened
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    feedback.value = {
      title: '',
      description: '',
      image: '',
      email: '',
    };
  }
});

const submitFeedback = () => {
  emit('submitFeedback', feedback.value);
  emit('close');
};
</script>

<style scoped>
/* Add any specific styles for the modal here if needed */
</style> 