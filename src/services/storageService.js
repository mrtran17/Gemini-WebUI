// src/services/storageService.js
const API_KEY_NAME = 'geminiApiKey_scriptUI';
const SETTINGS_NAME = 'geminiSettings_scriptUI';
const CONVERSATIONS_NAME = 'geminiConversations_scriptUI';
const LAST_CONVO_ID_NAME = 'lastActiveConversationId_scriptUI';

export const storageService = {
  getApiKey: () => localStorage.getItem(API_KEY_NAME),
  saveApiKey: (key) => localStorage.setItem(API_KEY_NAME, key),
  removeApiKey: () => localStorage.removeItem(API_KEY_NAME),

  getSettings: () => {
    const saved = localStorage.getItem(SETTINGS_NAME);
    return saved ? JSON.parse(saved) : null;
  },
  saveSettings: (settings) => localStorage.setItem(SETTINGS_NAME, JSON.stringify(settings)),

  getConversations: () => {
    const saved = localStorage.getItem(CONVERSATIONS_NAME);
    return saved ? JSON.parse(saved) : {};
  },
  saveConversations: (conversations) => localStorage.setItem(CONVERSATIONS_NAME, JSON.stringify(conversations)),

  getLastActiveConversationId: () => localStorage.getItem(LAST_CONVO_ID_NAME),
  saveLastActiveConversationId: (id) => localStorage.setItem(LAST_CONVO_ID_NAME, id),
  removeLastActiveConversationId: () => localStorage.removeItem(LAST_CONVO_ID_NAME),
};