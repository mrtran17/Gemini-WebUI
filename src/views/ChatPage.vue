<template>
  <div class="flex h-full">
    <SidebarLeft @new-chat="handleNewChat" @open-settings="handleOpenSettingsModal"
      @select-menu-item="selectedMenuItem = $event" :selected-menu-item="selectedMenuItem" />
    <div class="flex-1 flex flex-col bg-gray-100 dark:bg-slate-800/50 overflow-hidden">
      <ChatView v-if="selectedMenuItem === 'chat'" :current-conversation="currentConversation"
        :api-key-present="!!apiKey" :is-loading-indicator="isLoading" :available-models="AVAILABLE_MODELS"
        :getModelDisplayNameExt="getModelDisplayName" @send-message="handleSendMessage"
        @model-changed="handleModelChange" ref="chatViewRef" :active-model-id="currentConversation?.model" />
      <ProjectTableView v-if="selectedMenuItem === 'project'" />

      <!-- Add other views here as needed, e.g., for 'templates' -->
    </div>
    <SidebarRightConversationList :conversations="sortedConversationsArray"
      :current-conversation-id="currentConversationId" @switch-conversation="handleSwitchConversation"
      @delete-conversation="handleDeleteConversation" @updateConversationTitle="handleUpdateConversationTitle" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import SidebarLeft from '../components/SidebarLeft.vue';
import ChatView from '../components/ChatView.vue'; // Giả sử chat.vue được đổi tên hoặc import đúng
import SidebarRightConversationList from '../components/SidebarRightConversationList.vue';
import ProjectTableView from '../views/ProjectTableView.vue'; // Import the new component

import { useSettings } from '../composables/useSettings';
import { useConversations } from '../composables/useConversations';
import { useNotifications } from '../composables/useNotifications';

const emit = defineEmits(['openSettings', 'openDeveloperInfo']);

// Add state to track the selected menu item
const selectedMenuItem = ref('chat'); // Initialize with 'chat'

const { apiKey, settings } = useSettings();
const { showToast } = useNotifications();
const {
  conversations,
  currentConversationId,
  currentConversation,
  isLoading,
  loadConversationsFromStorage,
  startNewConversation,
  switchConversation,
  deleteConversation,
  addMessageToConversation,
  updateConversationModel,
  updateConversationTitle, // Hàm này được import từ useConversations
} = useConversations(apiKey, settings, showToast);

const chatViewRef = ref(null);

const AVAILABLE_MODELS = [
  { value: 'gemini-2.5-flash-preview-05-20', text: 'Gemini 2.5 Flash Preview' },
  { value: 'gemini-2.5-pro-preview-05-06', text: 'Gemini 2.5 Pro Preview' },
  { value: 'gemini-2.0-flash', text: 'Gemini 2.0 Flash' },
  { value: 'gemini-1.5-flash-latest', text: 'Gemini 1.5 Flash (Latest)' },
  { value: 'gemini-pro', text: 'Gemini Pro' },
  { value: 'gemma-3-1b-it', text: 'Gemma 3 1B IT' },
  { value: 'gemma-3-4b-it', text: 'Gemma 3 4B IT' },
  { value: 'gemma-3-27b-it', text: 'Gemma 3 27B IT' },
  { value: 'gemma-3n-e4b-it', text: 'Gemma 3n E4B' },
];

const getModelDisplayName = (modelValue) => {
  const model = AVAILABLE_MODELS.find(m => m.value === modelValue);
  return model ? model.text : modelValue;
};

const handleNewChat = () => { startNewConversation(); };
const handleSendMessage = ({ text, file }) => {
  if (currentConversationId.value) {
    addMessageToConversation(currentConversationId.value, text, file);
  } else {
    // If no conversation is selected, start a new one and then add the message
    startNewConversation();
    // useConversations composable should update currentConversationId.value
    // Add message to the newly created conversation
    nextTick(() => { // Use nextTick to ensure currentConversationId.value is updated
      if (currentConversationId.value) {
        addMessageToConversation(currentConversationId.value, text, file);
      } else {
        showToast('Có lỗi xảy ra khi tạo cuộc trò chuyện mới.', 'error');
      }
    });
  }
};
const handleModelChange = (newModel) => {
  if (currentConversationId.value) {
    updateConversationModel(currentConversationId.value, newModel);
  }
};
const handleSwitchConversation = (conversationId) => { switchConversation(conversationId); };
const handleDeleteConversation = (conversationId) => {
  deleteConversation(conversationId);
  // Removed toast notification from here, moved to useConversations.js
};

// --- SỬA LỖI CHÍNH Ở ĐÂY ---
// Hàm này nhận một object payload từ event emit
const handleUpdateConversationTitle = (payload) => {
  // Kiểm tra xem payload có đúng định dạng không
  if (payload && typeof payload.id === 'string' && typeof payload.title === 'string') {
    console.log('ChatPage: Updating title for ID:', payload.id, 'to:', payload.title);
    updateConversationTitle(payload.id, payload.title); // Gọi hàm từ useConversations
  } else {
    console.error('ChatPage: Invalid payload received for updateConversationTitle:', payload);
    showToast('Lỗi khi cập nhật tên cuộc trò chuyện: Dữ liệu không hợp lệ.', 'error');
  }
};
// --- KẾT THÚC SỬA LỖI ---

const handleOpenSettingsModal = () => { emit('openSettings'); };
const handleOpenDeveloperInfo = () => { emit('openDeveloperInfo'); };

onMounted(() => {
  loadConversationsFromStorage();
  // Logic focus input đã được chuyển vào ChatView (trước đây là chat.vue)
});

const sortedConversationsArray = computed(() => {
  return Object.values(conversations.value).sort(
    (a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0)
  );
});

</script>

<style scoped>
/* Add component-specific styles here */
</style>