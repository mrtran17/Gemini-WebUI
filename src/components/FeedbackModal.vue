<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" :class="{ 'opacity-0': !isOpen }" @click.self="handleClose">
      <form
        name="feedback-catwebui"
        @submit.prevent="submitFeedback"
        class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-out"
        :class="{ 'scale-95': !isOpen, 'scale-100': isOpen }"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 flex items-center space-x-2">
            <font-awesome-icon icon="lightbulb" class="text-blue-500" />
            <span>Gửi Góp ý</span>
          </h3>
          <button type="button" @click="handleClose" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg" :disabled="isSubmitting && !formSubmittedSuccessfully">
            <font-awesome-icon icon="times" />
          </button>
        </div>
  
        <div class="p-6 space-y-4">
          <div>
            <label for="feedback-title" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <font-awesome-icon icon="tag" class="text-gray-500 dark:text-slate-400 text-xs" />
              <span>Tiêu đề <span class="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              id="feedback-title"
              name="title"
              v-model="feedback.title"
              @blur="validateField('title')"
              :disabled="isSubmitting || formSubmittedSuccessfully"
              class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-slate-700"
              :class="errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'"
              placeholder="Nhập tiêu đề góp ý của bạn"
              required
            />
            <p v-if="errors.title" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.title }}</p>
          </div>
  
          <div>
            <label for="feedback-description" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <font-awesome-icon icon="pencil-alt" class="text-gray-500 dark:text-slate-400 text-xs" />
              <span>Mô tả <span class="text-red-500">*</span></span>
            </label>
            <textarea
              id="feedback-description"
              name="description"
              v-model="feedback.description"
              @blur="validateField('description')"
              :disabled="isSubmitting || formSubmittedSuccessfully"
              rows="4"
              class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm resize-y disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-slate-700"
              :class="errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'"
              placeholder="Mô tả chi tiết góp ý hoặc vấn đề bạn gặp phải"
              required
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.description }}</p>
          </div>
  
          <div>
            <label for="feedback-email" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <font-awesome-icon icon="envelope" class="text-gray-500 dark:text-slate-400 text-xs" />
              <span>Email (Không bắt buộc)</span>
            </label>
            <input
              type="email"
              id="feedback-email"
              name="email"
              v-model="feedback.email"
              @blur="validateField('email')"
              :disabled="isSubmitting || formSubmittedSuccessfully"
              class="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-slate-700"
              :class="errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'"
              placeholder="Địa chỉ email của bạn (tùy chọn)"
            />
             <p v-if="errors.email" class="mt-1 text-xs text-red-500 dark:text-red-400">{{ errors.email }}</p>
          </div>
        </div>
  
        <div v-if="submissionMessage" class="px-6 pb-4">
          <div
            class="p-3 rounded-md text-sm flex items-center space-x-2"
            :class="{
              'bg-green-50 dark:bg-green-700 text-green-700 dark:text-green-100': submissionStatus === 'success',
              'bg-red-50 dark:bg-red-700 text-red-700 dark:text-red-100': submissionStatus === 'error',
            }"
          >
            <font-awesome-icon :icon="submissionStatus === 'success' ? 'check-circle' : 'exclamation-circle'" />
            <span>{{ submissionMessage }}</span>
          </div>
        </div>
  
        <div class="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end space-x-3">
          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting && !formSubmittedSuccessfully"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50"
          >
            {{ formSubmittedSuccessfully ? 'Đóng' : 'Hủy' }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid || formSubmittedSuccessfully"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[120px]"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <font-awesome-icon v-if="!isSubmitting && !formSubmittedSuccessfully" icon="paper-plane" class="mr-2" />
            {{ isSubmitting ? 'Đang gửi...' : (formSubmittedSuccessfully ? 'Đã gửi' : 'Gửi Góp ý') }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['close', 'submitFeedback']);
  
  const basinEndpoint = 'https://usebasin.com/f/214be1343870';
  
  const feedback = ref({
    title: '',
    description: '',
    email: '',
  });
  
  const errors = ref({});
  const isSubmitting = ref(false);
  const submissionStatus = ref(null);
  const submissionMessage = ref('');
  const formSubmittedSuccessfully = ref(false); // Trạng thái mới
  
  const resetForm = () => {
    feedback.value = { title: '', description: '', email: '' };
    errors.value = {};
    isSubmitting.value = false;
    submissionStatus.value = null;
    submissionMessage.value = '';
    formSubmittedSuccessfully.value = false; // Reset trạng thái này
  };
  
  watch(() => props.isOpen, (newVal, oldVal) => {
    // Chỉ reset khi modal được mở từ trạng thái đóng
    if (newVal && !oldVal) {
      resetForm();
    }
  });
  
  const handleClose = () => {
    // Chỉ emit close nếu không đang trong quá trình submit thực sự (trừ khi đã submit thành công)
    if (!isSubmitting.value || formSubmittedSuccessfully.value) {
      emit('close');
    }
  };
  
  const validateField = (field) => {
    if (formSubmittedSuccessfully.value) return; // Không validate nếu form đã gửi thành công
    errors.value[field] = '';
    switch (field) {
      case 'title':
        if (!feedback.value.title.trim()) errors.value.title = 'Tiêu đề không được để trống.';
        break;
      case 'description':
        if (!feedback.value.description.trim()) errors.value.description = 'Mô tả không được để trống.';
        break;
      case 'email':
        if (feedback.value.email.trim() && !/^\S+@\S+\.\S+$/.test(feedback.value.email)) {
          errors.value.email = 'Địa chỉ email không hợp lệ.';
        }
        break;
    }
  };
  
  const validateForm = () => {
    if (formSubmittedSuccessfully.value) return true; // Coi như hợp lệ nếu đã gửi thành công
    errors.value = {};
    validateField('title');
    validateField('description');
    validateField('email');
    return !Object.values(errors.value).some(error => error !== '');
  };
  
  const isFormValid = computed(() => {
    if (formSubmittedSuccessfully.value) return false; // Không cho submit lại nếu đã thành công
    return feedback.value.title.trim() !== '' && feedback.value.description.trim() !== '' && !errors.value.email;
  });
  
  const submitFeedback = async () => {
    submissionStatus.value = null;
    submissionMessage.value = '';
  
    if (!validateForm()) {
      submissionStatus.value = 'error';
      submissionMessage.value = 'Vui lòng kiểm tra lại các thông tin đã nhập.';
      return;
    }
  
    isSubmitting.value = true;
  
    const payload = {
      'form-name': 'feedback-catwebui',
      ...feedback.value,
    };
  
    try {
      const response = await fetch(basinEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        submissionStatus.value = 'success';
        submissionMessage.value = 'Góp ý của bạn đã được gửi thành công! Cảm ơn bạn.';
        formSubmittedSuccessfully.value = true; // Đánh dấu đã gửi thành công
        emit('submitFeedback', { ...feedback.value });
        // Không tự động đóng modal nữa
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Không thể gửi góp ý. Vui lòng thử lại.' }));
        submissionStatus.value = 'error';
        submissionMessage.value = errorData.error || 'Có lỗi xảy ra từ máy chủ. Vui lòng thử lại.';
        console.error('Basin submission error:', errorData);
      }
    } catch (error) {
      submissionStatus.value = 'error';
      submissionMessage.value = 'Lỗi kết nối mạng hoặc không thể gửi form. Vui lòng thử lại.';
      console.error('Network or other error submitting form:', error);
    } finally {
      isSubmitting.value = false; // Đặt isSubmitting thành false SAU KHI tất cả xử lý hoàn tất
    }
  };
  </script>
  
  <style scoped>
  .min-w-\[120px\] {
    min-width: 120px;
  }
  /* Thêm style cho input/textarea bị disabled nếu cần */
  .disabled\:opacity-70:disabled {
    opacity: 0.7;
  }
  .disabled\:bg-gray-100:disabled {
    background-color: #f3f4f6; /* Tailwind gray-100 */
  }
  .dark .disabled\:bg-slate-700:disabled {
    background-color: #334155; /* Tailwind slate-700 */
  }
  </style>