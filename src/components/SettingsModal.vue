<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
    :class="isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    @click.self="closeModal"
  >
    <div
      v-if="isOpen"
      class="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-xl shadow-2xl w-full max-w-lg border dark:border-slate-700 flex flex-col max-h-[90vh] transform transition-all duration-300 ease-in-out"
      :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
    >
      <div class="flex justify-between items-center mb-5 md:mb-6 pb-3 border-b dark:border-slate-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100">
          <font-awesome-icon icon="cog" class="mr-2 text-blue-500" />Cài đặt chung
        </h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <font-awesome-icon icon="times" class="text-2xl" />
        </button>
      </div>

      <div class="overflow-y-auto space-y-5 md:space-y-6 pr-1 md:pr-2 no-scrollbar flex-grow custom-scrollbar">
        <div class="space-y-2">
          <label for="temperatureInput" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
            <font-awesome-icon icon="thermometer-half" class="mr-2 text-orange-500" />Temperature:
            <span class="font-bold text-orange-600 dark:text-orange-400">{{ localSettings.temperature.toFixed(1) }}</span>
          </label>
          <input
            type="range"
            id="temperatureInput"
            v-model.number="localSettings.temperature"
            min="0"
            max="2"
            step="0.1"
            class="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-500 dark:text-slate-400">
            Cao hơn = sáng tạo hơn, thấp hơn = chính xác hơn. (Mặc định: 0.7)
          </p>
        </div>

        <div class="space-y-2">
          <label for="systemInstructionInput" class="block text-sm font-medium text-gray-700 dark:text-slate-300">
            <font-awesome-icon icon="user-cog" class="mr-2 text-green-500" />System Instructions
          </label>
          <textarea
            id="systemInstructionInput"
            v-model="localSettings.systemInstruction"
            rows="4"
            class="w-full bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 resize-y min-h-[80px]"
            placeholder="Ví dụ: Bạn là một trợ lý AI vui tính và hữu ích, luôn trả lời bằng tiếng Việt."
          ></textarea>
          <p class="text-xs text-gray-500 dark:text-slate-400">
            Hướng dẫn AI cách phản hồi. Để trống nếu muốn AI tự do.
          </p>
        </div>

        <div class="space-y-3 pt-3 border-t dark:border-slate-700">
          <h3 class="text-md font-semibold text-gray-800 dark:text-slate-200">
            <font-awesome-icon icon="key" class="mr-2 text-purple-500" />Quản lý API Key
          </h3>
          <div v-if="showApiKeyDisplay" class="p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-md">
            <div class="flex flex-col space-y-3">
              <p class="text-sm text-gray-700 dark:text-slate-300">
                Key:
                <span class="font-mono bg-gray-200 dark:bg-slate-600 px-2 py-0.5 rounded text-xs">
                  {{ 'AIza...' + localApiKey.slice(-4) }}
                </span>
              </p>
              <div class="flex space-x-2">
                <button @click="editApiKey" class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors flex items-center">
                  <font-awesome-icon icon="edit" class="mr-1" />Sửa
                </button>
                <button @click="confirmDeleteApiKey" class="text-xs bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors flex items-center">
                  <font-awesome-icon icon="trash-alt" class="mr-1" />Xoá
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <label for="settingsApiKeyInput" class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nhập Google AI Studio API Key:</label>
            <input
              type="password"
              id="settingsApiKeyInput"
              v-model="apiKeyInputValue"
              class="w-full bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="AIza..."
              ref="apiKeyInputRef"
            />
            <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Lấy tại
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline dark:text-blue-400">Google AI Studio</a>.
            </p>
            <button @click="saveNewApiKey" class="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center">
              <font-awesome-icon icon="save" class="mr-1.5" />Lưu Key mới
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 md:mt-8 pt-4 border-t dark:border-slate-700 flex justify-end space-x-3">
        <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors">
          Huỷ
        </button>
        <button @click="saveAllSettings" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center">
          <font-awesome-icon icon="check" class="mr-1.5" />Lưu thay đổi
        </button>
      </div>
    </div>
  </div>

  <!-- Custom Confirmation Modal -->
  <ConfirmationModal
    :isOpen="isConfirmModalOpen"
    message="Bạn có chắc muốn xoá API key đã lưu?"
    @confirm="handleDeleteApiKey"
    @cancel="closeConfirmModal"
  />
</template>

<script setup>
import { ref, reactive, watch, nextTick, computed } from 'vue';
import { useNotifications } from '@/composables/useNotifications';
import ConfirmationModal from './ConfirmationModal.vue'; // Import the new component

const props = defineProps({
  isOpen: Boolean,
  initialApiKey: String,
  initialSettings: Object,
});

const emit = defineEmits(['close', 'saveApiKey', 'deleteApiKey', 'saveSettings']);
const { showToast } = useNotifications();

const localApiKey = ref('');
const apiKeyInputValue = ref('');
const localSettings = reactive({ temperature: 0.7, systemInstruction: '' });
const showApiKeyDisplay = ref(false);
const apiKeyInputRef = ref(null);
const isConfirmModalOpen = ref(false); // State for the custom confirmation modal

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    localApiKey.value = props.initialApiKey || '';
    apiKeyInputValue.value = '';
    showApiKeyDisplay.value = !!props.initialApiKey;
    if (props.initialSettings) {
      localSettings.temperature = props.initialSettings.temperature;
      localSettings.systemInstruction = props.initialSettings.systemInstruction;
    }
    if (!props.initialApiKey) {
        nextTick(() => apiKeyInputRef.value?.focus());
    }
  }
});

const editApiKey = () => {
  showApiKeyDisplay.value = false;
  apiKeyInputValue.value = '';
  nextTick(() => apiKeyInputRef.value?.focus());
};

const saveNewApiKey = () => {
  const key = apiKeyInputValue.value.trim();
  if (key && key.startsWith("AIza")) {
    localApiKey.value = key;
    showApiKeyDisplay.value = true;
    showToast('API Key đã được cập nhật (chưa lưu).', 'info');
  } else {
    showToast("Vui lòng nhập API key hợp lệ (phải bắt đầu bằng AIza...).", "error");
    apiKeyInputRef.value?.focus();
  }
};

const confirmDeleteApiKey = () => {
  isConfirmModalOpen.value = true; // Open the custom confirmation modal
};

const handleDeleteApiKey = () => {
  emit('deleteApiKey');
  localApiKey.value = '';
  showApiKeyDisplay.value = false;
  showToast('API Key đã được xoá.');
  closeConfirmModal(); // Close the confirmation modal
  closeModal(); // Close the settings modal
};

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false; // Close the custom confirmation modal
};

const saveAllSettings = () => {
  console.log('Attempting to save settings...');
  console.log('Local API Key:', localApiKey.value);
  console.log('API Key Input Value:', apiKeyInputValue.value);
  console.log('Show API Key Display:', showApiKeyDisplay.value);
  console.log('Local Settings:', { ...localSettings });

  if (!showApiKeyDisplay.value && apiKeyInputValue.value.trim()) {
     const key = apiKeyInputValue.value.trim();
      if (key && key.startsWith("AIza")) {
        console.log('Emitting saveApiKey with new key:', key);
        emit('saveApiKey', key);
      } else {
        console.log('Invalid new API key format.');
        showToast("API key mới chưa được lưu hoặc không hợp lệ.", "error");
        apiKeyInputRef.value?.focus();
        return;
      }
  } else if (showApiKeyDisplay.value && localApiKey.value !== props.initialApiKey) {
      console.log('Emitting saveApiKey with existing key:', localApiKey.value);
      emit('saveApiKey', localApiKey.value);
  } else if (!localApiKey.value && !apiKeyInputValue.value.trim() && !props.initialApiKey) {
      console.log('No API key provided.');
      showToast("Vui lòng cung cấp API Key.", "error");
      showApiKeyDisplay.value = false;
      nextTick(() => apiKeyInputRef.value?.focus());
      return;
  }


  const temp = parseFloat(localSettings.temperature);
  if (isNaN(temp) || temp < 0 || temp > 2) {
    console.log('Invalid temperature value.');
    showToast("Lỗi: Temperature phải từ 0.0 đến 2.0.", "error");
    return;
  }

  console.log('Emitting saveSettings with:', { ...localSettings });
  emit('saveSettings', { ...localSettings });

  // Show success toast here
  showToast('Đã cập nhập cài đặt!', 'success');

  console.log('Closing modal.');
  closeModal(); // No parameter needed
};


const closeModal = () => { // Remove saved parameter
  emit('close'); // Emit close without parameter
};
</script>