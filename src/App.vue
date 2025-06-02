<template>
  <div id="app-container" class="h-screen flex flex-col">
    <!-- You might have a global header/navbar here if needed across all pages -->
    <!-- Or the sidebars could be part of a layout component used by each route -->
    <router-view @open-settings="isGlobalSettingsModalOpen = true" @open-developer-info="isGlobalDeveloperInfoModalOpen = true" /> <!-- Routed components will be displayed here -->

    <!-- Global modals could still live here or be teleported -->
    <SettingsModal
      :is-open="isGlobalSettingsModalOpen"
      :initial-api-key="globalApiKey"
      :initial-settings="globalSettings"
      @close="closeGlobalSettingsModal"
      @save-api-key="updateGlobalApiKey"
      @delete-api-key="removeGlobalApiKey"
      @save-settings="updateGlobalSettings"
    />
    <DeveloperInfoModal
      :is-open="isGlobalDeveloperInfoModalOpen"
      @close="closeGlobalDeveloperInfoModal"
    />
    <Toast :visible="globalToast.visible" :message="globalToast.message" :type="globalToast.type" @dismiss="hideGlobalToast" />
  </div>
</template>

<script setup>
// App.vue would now manage truly global state/modals if any,
// or be even simpler if all state is scoped to views/composables.
import { ref } from 'vue';
import SettingsModal from './components/SettingsModal.vue';
import DeveloperInfoModal from './components/DeveloperInfoModal.vue';
import Toast from './components/Toast.vue';
// Import global composables if needed (e.g., for theme, global notifications)
import { useTheme } from './composables/useTheme';
import { useNotifications } from './composables/useNotifications'; // Assuming global toast
import { useSettings } from './composables/useSettings'; // Assuming global settings for modal

useTheme();
const { toast: globalToast, showToast, hideToast: hideGlobalToast } = useNotifications();
const { apiKey: globalApiKey, settings: globalSettings, saveApiKey, deleteApiKey, saveSettings } = useSettings();


const isGlobalSettingsModalOpen = ref(false);
const isGlobalDeveloperInfoModalOpen = ref(false);
// Logic to open/close global settings modal, update global API key/settings
// This would be triggered by events from child components (like SidebarLeft if it remains global)
// or managed by a global state solution like Pinia.

const closeGlobalSettingsModal = (saved) => {
    isGlobalSettingsModalOpen.value = false;
    if (saved) showToast('Đã cập nhập cài đặt!', 'success');
};
 const updateGlobalApiKey = (key) => {
     console.log('App.vue: Calling saveApiKey with key:', key);
     saveApiKey(key);
     console.log('App.vue: globalApiKey after saving:', globalApiKey.value);
 };
 const removeGlobalApiKey = () => {
    console.log('App.vue: Calling deleteApiKey');
    deleteApiKey();
    console.log('App.vue: globalApiKey after deleting:', globalApiKey.value);
 };
 const updateGlobalSettings = (s) => {
     console.log('App.vue: Calling saveSettings with settings:', s);
     Object.assign(globalSettings, s);
     saveSettings();
     console.log('App.vue: globalSettings after saving:', globalSettings);
 };

// If SidebarLeft needs to trigger a global settings modal, it would emit an event
// that App.vue listens to, or you'd use a state management solution.
</script>