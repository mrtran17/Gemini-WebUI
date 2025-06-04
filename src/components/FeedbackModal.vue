<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" :class="{ 'opacity-0': !isOpen }">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-out" :class="{ 'scale-95': !isOpen, 'scale-100': isOpen }" @click.stop>
      <div class="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 flex items-center space-x-2">
          <font-awesome-icon icon="lightbulb" class="text-blue-500" />
          <span>Gửi Góp ý</span>
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg">
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <div class="p-6 space-y-5">
        <div>
          <label for="feedback-title" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <font-awesome-icon icon="tag" class="text-gray-500 dark:text-slate-400 text-xs" />
            <span>Tiêu đề</span>
          </label>
          <input
            type="text"
            id="feedback-title"
            v-model="feedback.title"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm"
            placeholder="Nhập tiêu đề góp ý của bạn"
          />
        </div>
        <div>
          <label for="feedback-description" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <font-awesome-icon icon="pencil-alt" class="text-gray-500 dark:text-slate-400 text-xs" />
            <span>Mô tả</span>
          </label>
          <textarea
            id="feedback-description"
            v-model="feedback.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm resize-y"
            placeholder="Mô tả chi tiết góp ý hoặc vấn đề bạn gặp phải"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <font-awesome-icon icon="image" class="text-gray-500 dark:text-slate-400 text-xs" />
            <span>Hình ảnh (Kéo thả hoặc Nhấp để chọn)</span>
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer transition-all duration-200 ease-in-out"
            :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDraggingOver }"
            @dragover.prevent="isDraggingOver = true"
            @dragleave="isDraggingOver = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <div class="space-y-1 text-center">
              <font-awesome-icon icon="cloud-upload-alt" class="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
              <div class="flex text-sm text-gray-600 dark:text-slate-400">
                <p class="pl-1">
                  Kéo và thả tệp vào đây hoặc
                  <span class="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500 dark:hover:text-blue-300">nhấp để chọn</span>
                </p>
              </div>
              <p class="text-xs text-gray-500 dark:text-slate-500">PNG, JPG, GIF, WEBP tối đa 10MB</p>
            </div>
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="sr-only" />
          </div>
          <div v-if="feedback.imagePreview" class="mt-4 relative">
            <img :src="feedback.imagePreview" alt="Image Preview" class="w-full h-40 object-cover rounded-lg shadow-md border border-gray-300 dark:border-slate-600" />
            <button @click="removeImage" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg transition-colors">
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>
        <div>
          <label for="feedback-email" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
            <font-awesome-icon icon="envelope" class="text-gray-500 dark:text-slate-400 text-xs" />
            <span>Email (Không bắt buộc)</span>
          </label>
          <input
            type="email"
            id="feedback-email"
            v-model="feedback.email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm"
            placeholder="Địa chỉ email của bạn (tùy chọn)"
          />
        </div>
      </div>
      <div class="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-200"
        >
          Hủy
        </button>
        <button
          @click="submitFeedback"
          :disabled="!feedback.title || !feedback.description"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <font-awesome-icon icon="paper-plane" class="mr-2" />
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
  image: null,
  imagePreview: null,
  email: '',
});

const isDraggingOver = ref(false);
const fileInput = ref(null);

// Reset feedback form when modal is opened
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    feedback.value = {
      title: '',
      description: '',
      image: null,
      imagePreview: null,
      email: '',
    };
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  processFile(file);
};

const handleDrop = (event) => {
  isDraggingOver.value = false;
  const file = event.dataTransfer.files[0];
  processFile(file);
};

const processFile = (file) => {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Chỉ chấp nhận tệp ảnh.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('Kích thước tệp tối đa là 10MB.');
    return;
  }

  feedback.value.image = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    feedback.value.imagePreview = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  feedback.value.image = null;
  feedback.value.imagePreview = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const submitFeedback = async () => {
  if (!feedback.value.title || !feedback.value.description) {
    alert('Vui lòng nhập Tiêu đề và Mô tả góp ý.');
    return;
  }

  const formData = new FormData();
  formData.append('form-name', 'feedback');
  formData.append('title', feedback.value.title);
  formData.append('description', feedback.value.description);
  if (feedback.value.image) {
    formData.append('image', feedback.value.image);
  }
  formData.append('email', feedback.value.email);

  try {
    const response = await fetch('/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Góp ý đã được gửi thành công!');
      emit('submitFeedback', {
        title: feedback.value.title,
        description: feedback.value.description,
        image: feedback.value.image,
        email: feedback.value.email,
      });
      emit('close');
    } else {
      alert('Có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    alert('Có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại.');
  }
};
</script>

<style scoped>
/* No specific styles needed here, relying on Tailwind CSS */
</style> 