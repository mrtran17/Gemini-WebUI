// src/composables/useSettings.js
import { ref, reactive, onMounted } from 'vue';
import { storageService } from '@/services/storageService';

const defaultSettings = {
  temperature: 0.7,
  systemInstruction: '',
};

// --- Shared State (Singleton) ---
const apiKey = ref(null);
const settings = reactive({ ...defaultSettings });
let isInitialized = false; // Flag to ensure loading happens only once

// --- Shared Functions ---
const loadApiKey = () => {
  apiKey.value = storageService.getApiKey();
};

const saveApiKey = (newKey) => {
  storageService.saveApiKey(newKey);
  apiKey.value = newKey;
};

const deleteApiKey = () => {
  storageService.removeApiKey();
  apiKey.value = null;
};

const loadSettings = () => {
  const storedSettings = storageService.getSettings();
  if (storedSettings) {
    Object.assign(settings, storedSettings);
  } else {
    storageService.saveSettings(defaultSettings); // Save defaults if nothing found
  }
};

const saveSettings = () => {
  storageService.saveSettings(settings);
};

// --- Composable Function ---
export function useSettings() {
  // Initialize state from storage only once
  if (!isInitialized) {
    loadApiKey();
    loadSettings();
    isInitialized = true;
  }

  // onMounted hook from original composable is not needed here for singleton state loading
  // onMounted(() => {
  //   loadApiKey();
  //   loadSettings();
  // });

  return {
    apiKey,
    settings,
    loadApiKey,
    saveApiKey,
    deleteApiKey,
    loadSettings,
    saveSettings,
  };
}