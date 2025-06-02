<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
    :class="isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
  >
    <div
      class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-in-out"
      :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      @click.stop
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Xác nhận</h3>
      <p class="text-sm text-gray-700 dark:text-slate-300 mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-3">
        <button
          @click="cancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
        >
          Huỷ
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: 'Bạn có chắc chắn muốn thực hiện hành động này?',
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
/* Add your custom styles here */
</style> 