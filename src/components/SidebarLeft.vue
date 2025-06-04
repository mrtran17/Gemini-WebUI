<template>
  <div class="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col shrink-0">
    <div class="p-4">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-black dark:bg-slate-700 rounded-lg flex items-center justify-center text-white dark:text-slate-300">
          <font-awesome-icon icon="cat" class="text-lg" />
        </div>
        <span class="font-semibold text-lg text-gray-900 dark:text-slate-100">WebUI LLM</span>
      </div>
    </div>

    <div class="p-4">
      <button
        @click="$emit('newChat')"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2"
      >
        <font-awesome-icon icon="plus" />
        <span>Trò chuyện mới</span>
      </button>
    </div>

    <nav class="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
      <div
        :class="[
          'flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer',
          selectedMenuItem === 'chat'
            ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300'
            : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700',
        ]"
        @click="$emit('selectMenuItem', 'chat')"
      >
        <font-awesome-icon icon="comments" class="text-sm" />
        <span class="text-sm font-medium">AI Chat</span>
      </div>

      <div
        :class="[
          'flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer',
          selectedMenuItem === 'templates'
            ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300'
            : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700',
        ]"
        @click="$emit('selectMenuItem', 'templates')"
      >
        <font-awesome-icon icon="file-alt" class="text-sm" />
        <span class="text-sm">Mẫu</span>
      </div>
    </nav>

    <div class="p-4 border-t border-gray-200 dark:border-slate-700">
      <div class="space-y-1">
        <div class="text-gray-500 dark:text-slate-400 text-xs font-medium mb-2">
          Cài đặt & Trợ giúp
        </div>
        <div
          @click="$emit('openSettings')"
          class="flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
        >
          <font-awesome-icon icon="cog" class="text-sm" />
          <span class="text-sm">Cài đặt</span>
        </div>
        <div
          @click="isDeveloperInfoModalOpen = true"
          class="flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
        >
          <font-awesome-icon icon="id-card" class="text-sm" />
          <span class="text-sm">Thông tin nhà phát triển</span>
        </div>
        <div
          @click="isFeedbackModalOpen = true"
          class="flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
        >
          <font-awesome-icon icon="lightbulb" class="text-sm" />
          <span class="text-sm">Góp ý</span>
        </div>
      </div>
      <div class="flex items-center justify-between mt-4 p-3">
        <span class="text-sm text-gray-600 dark:text-slate-300">Chế độ giao diện</span>
        <div
          class="theme-toggle"
          :class="{ 'dark-mode': currentTheme === 'dark' }"
          @click="toggleTheme"
          role="switch"
          :aria-checked="currentTheme === 'dark'"
          tabindex="0"
          @keydown.enter.space.prevent="toggleTheme"
        >
          <div class="theme-toggle-slider">
            <font-awesome-icon :icon="currentTheme === 'dark' ? 'moon' : 'sun'" class="theme-toggle-icon" />
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-3 mt-4 p-2">
        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
          <font-awesome-icon icon="cat" class="text-lg" />
        </div>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-slate-100">Phước Trần</div>
          <div class="text-xs text-gray-500 dark:text-slate-400">
            tranhuuphuoc1701@gmail.com
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Developer Info Modal -->
  <DeveloperInfoModal :isOpen="isDeveloperInfoModalOpen" @close="isDeveloperInfoModalOpen = false" />

  <!-- Feedback Modal -->
  <FeedbackModal :isOpen="isFeedbackModalOpen" @close="isFeedbackModalOpen = false" @submitFeedback="handleFeedbackSubmit" />
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from '@/composables/useTheme';
import DeveloperInfoModal from './DeveloperInfoModal.vue';
import FeedbackModal from './FeedbackModal.vue';

defineEmits(['newChat', 'openSettings', 'selectMenuItem']);

const props = defineProps({
  selectedMenuItem: {
    type: String,
    default: 'chat',
  },
});

const { theme: currentTheme, toggleTheme } = useTheme();

const isDeveloperInfoModalOpen = ref(false);
const isFeedbackModalOpen = ref(false);

// const handleFeedbackSubmit = (feedbackData) => {
//   console.log('Feedback Submitted:', feedbackData);
//   // Here you would typically send the feedbackData to your backend
//   alert('Cảm ơn bạn đã gửi góp ý!');
// };
</script>

<style scoped>
.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  background: #e2e8f0;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #cbd5e1;
}
.theme-toggle.dark-mode {
  background: #1e293b;
  border-color: #475569;
}
.theme-toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.theme-toggle.dark-mode .theme-toggle-slider {
  transform: translateX(30px);
  background: #0f172a;
}
.theme-toggle-icon {
  font-size: 10px;
  color: #64748b;
  transition: all 0.3s ease;
}
.theme-toggle.dark-mode .theme-toggle-icon {
  color: #fbbf24;
}
</style>