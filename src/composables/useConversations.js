// src/composables/useConversations.js
import { ref, computed, watch, nextTick } from 'vue';
import { storageService } from '@/services/storageService';
import { callGeminiAPI } from './useChatApi'; // Assuming this is your API call wrapper
import { v4 as uuidv4 } from 'uuid';

export function useConversations(apiKeyRef, settingsRef, showToastFn) {
  const conversations = ref({});
  const currentConversationId = ref(null);
  const isLoading = ref(false);

  const currentConversation = computed(() => {
    return currentConversationId.value ? conversations.value[currentConversationId.value] : null;
  });

  const loadConversationsFromStorage = async () => {
    conversations.value = storageService.getConversations();
    Object.values(conversations.value).forEach(convo => {
      convo.messages = convo.messages?.map(msg => ({...msg, id: msg.id || uuidv4() })) || [];
      if (!convo.id) convo.id = `conv_${Date.now()}_${uuidv4()}`;
      if (!convo.createdAt) convo.createdAt = Date.now();
      if (!convo.lastUpdated) convo.lastUpdated = convo.createdAt;
      // Ensure model always has a value, if not, assign default
      // Use default from settingsRef if available, otherwise a hardcoded fallback
      if (!convo.model) {
        convo.model = settingsRef.value?.defaultModel || 'gemini-2.5-flash-preview-05-20';
      }
    });

    const lastId = storageService.getLastActiveConversationId();
    if (lastId && conversations.value[lastId]) {
      currentConversationId.value = lastId;
    } else if (Object.keys(conversations.value).length > 0) {
      currentConversationId.value = Object.keys(conversations.value).sort(
        (a, b) => (conversations.value[b].lastUpdated || 0) - (conversations.value[a].lastUpdated || 0)
      )[0];
      if (currentConversationId.value) {
        storageService.saveLastActiveConversationId(currentConversationId.value);
      }
    } else {
        currentConversationId.value = null;
    }
  };

  const saveConversationsToStorage = () => {
    storageService.saveConversations(conversations.value);
    if (currentConversationId.value) {
      storageService.saveLastActiveConversationId(currentConversationId.value);
    } else {
      storageService.removeLastActiveConversationId();
    }
  };

  const startNewConversation = (modelId) => {
    if (!apiKeyRef.value) {
      showToastFn('Vui lòng nhập API Key để bắt đầu trò chuyện.', 'error');
      return;
    }
    const newId = `conv_${Date.now()}_${uuidv4()}`;
    // Use defaultModel from settingsRef, or the passed modelId, or a hardcoded fallback
    const defaultModel = modelId || settingsRef.value?.defaultModel || 'gemini-2.5-flash-preview-05-20';

    const modelDisplayNameForGreeting = defaultModel; // You might need a getModelDisplayName function here if you have one

    conversations.value[newId] = {
      id: newId,
      title: 'Trò chuyện mới',
      messages: [{
        id: uuidv4(),
        role: 'model',
        parts: [{ text: `Xin chào! Tôi là ${modelDisplayNameForGreeting}. Tôi có thể giúp gì cho bạn?` }],
        timestamp: Date.now(),
      }],
      model: defaultModel,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    currentConversationId.value = newId;
    saveConversationsToStorage();
  };

  const switchConversation = (id) => {
    if (conversations.value[id]) {
      currentConversationId.value = id;
      saveConversationsToStorage();
    }
  };

  const deleteConversation = async (idToDelete) => {
    if (!conversations.value[idToDelete]) return;

    delete conversations.value[idToDelete];

    if (currentConversationId.value === idToDelete) {
      currentConversationId.value = null;
      const remainingConvoIds = Object.keys(conversations.value);
      if (remainingConvoIds.length > 0) {
        currentConversationId.value = remainingConvoIds.sort(
          (a, b) => (conversations.value[b].lastUpdated || 0) - (conversations.value[a].lastUpdated || 0)
        )[0];
      }
    }
    saveConversationsToStorage();
    await nextTick();
    showToastFn('Đã xoá cuộc trò chuyện.', 'success');
  };

  const addMessageToConversation = async (convoId, text, fileInfo = null) => {
    if (!apiKeyRef.value) {
      showToastFn('API Key not found. Please configure in settings.', 'error');
      return;
    }
    const convo = conversations.value[convoId];
    if (!convo) {
        showToastFn('Conversation not found.', 'error');
        return;
    }

    isLoading.value = true;

    const userMessageParts = [];
    if (fileInfo) {
      userMessageParts.push({ inlineData: { mimeType: fileInfo.mimeType, data: fileInfo.data, fileName: fileInfo.name, previewUrl: fileInfo.previewUrl, isStoredRef: true } });
    }
    if (text && text.trim()) {
      userMessageParts.push({ text: text.trim() });
    }

    if(userMessageParts.length === 0) {
        showToastFn('Cannot send an empty message.', 'warn');
        isLoading.value = false;
        return;
    }

    convo.messages.push({
      id: uuidv4(),
      role: 'user',
      parts: userMessageParts,
      timestamp: Date.now(),
    });
    convo.lastUpdated = Date.now();
    await nextTick();
    saveConversationsToStorage();

    const historyForApi = convo.messages.slice(0, -1)
        .filter(msg => msg.role === 'user' || msg.role === 'model')
        .map(msg => ({
        role: msg.role,
        parts: msg.parts.map(p => {
            if (p.text) return { text: p.text };
            if (p.inlineData && p.inlineData.data && !p.inlineData.isStoredRef) {
                return { inlineData: { mimeType: p.inlineData.mimeType, data: p.inlineData.data }};
            }
            return null;
        }).filter(Boolean)
    })).filter(msg => msg.parts.length > 0);


    const currentMessageForApiParts = [];
    if (fileInfo) {
        currentMessageForApiParts.push({ inlineData: { mimeType: fileInfo.mimeType, data: fileInfo.data } });
    }
    if (text && text.trim()) {
        currentMessageForApiParts.push({ text: text.trim() });
    }

    // System instruction from settings (this is settingsRef.value from useSettings)
    const systemInstruction = settingsRef.value?.systemInstruction || '';
    const apiPayloadContents = [];

    if (systemInstruction.trim()) {
        apiPayloadContents.push({ role: 'user', parts: [{ text: systemInstruction }] });
        apiPayloadContents.push({ role: 'model', parts: [{ text: "OK." }] }); // Simulate model ack for system prompt
    }
    apiPayloadContents.push(...historyForApi);
    apiPayloadContents.push({ role: 'user', parts: currentMessageForApiParts });


    try {
      const aiResponseText = await callGeminiAPI(
        apiPayloadContents, // Contains history + current message + system instruction (if any)
        convo.model,
        apiKeyRef.value,
        settingsRef.value?.temperature ?? 0.7
        // The 'systemInstruction' variable itself is not passed as a separate argument here,
        // as it's already incorporated into apiPayloadContents, which is the standard way for Gemini API.
      );

      convo.messages.push({
        id: uuidv4(),
        role: 'model',
        parts: [{ text: aiResponseText }],
        timestamp: Date.now(),
      });

      if (convo.title === 'Trò chuyện mới' && convo.messages.filter(m => m.role === 'user').length === 1) {
        let titleBase = "Cuộc trò chuyện";
        const firstUserMsg = convo.messages.find(m => m.role === 'user');
        if (firstUserMsg?.parts) {
            const textPart = firstUserMsg.parts.find(p => p.text)?.text;
            const imgPart = firstUserMsg.parts.find(p => p.inlineData?.fileName);

            if (textPart) {
                titleBase = textPart;
            } else if (imgPart) {
                titleBase = `Hình ảnh: ${imgPart.inlineData.fileName}`;
            }
        }
        convo.title = titleBase.substring(0, 35) + (titleBase.length > 35 ? "..." : "");
      }

    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown API error';
      showToastFn(`Lỗi API: ${errorMessage}`, 'error');
      convo.messages.push({
        id: uuidv4(),
        role: 'error',
        parts: [{ text: `Lỗi: ${errorMessage}` }],
        timestamp: Date.now(),
      });
    } finally {
      convo.lastUpdated = Date.now();
      await nextTick();
      saveConversationsToStorage();
      isLoading.value = false;
    }
  };

  const updateConversationModel = (convoId, newModelId) => {
      const convo = conversations.value[convoId];
      if (convo && convo.model !== newModelId) {
          const oldModelId = convo.model;
          convo.model = newModelId;
          convo.lastUpdated = Date.now();
          // You might want a getModelDisplayName function here
          convo.messages.push({
              id: uuidv4(),
              role: 'system',
              parts: [{ text: `Model đã đổi từ ${oldModelId} thành ${newModelId}.` }],
              timestamp: Date.now(),
          });
          nextTick().then(saveConversationsToStorage);
      }
  };

  const updateConversationTitle = async (convoId, newTitle) => {
    const convo = conversations.value[convoId];
    if (convo && newTitle.trim() && convo.title !== newTitle.trim()) {
        convo.title = newTitle.trim();
        convo.lastUpdated = Date.now();
        await nextTick();
        saveConversationsToStorage();
    }
  };


  watch(apiKeyRef, (newKey, oldKey) => {
    if (!newKey && oldKey) {
      showToastFn('API Key đã bị xoá. Vui lòng cấu hình lại để tiếp tục trò chuyện.', 'warn');
      isLoading.value = false;
    }
    // No need to auto-start new conversation here, user can do it explicitly
  });

  // Watch for changes in global settings that might affect all conversations
  // or require specific actions. For systemInstruction, it's applied at API call time, so no explicit watch needed here
  // for that specific setting. If temperature changes globally, it's also picked up at API call time.
  // watch(settingsRef, (newSettings, oldSettings) => {
  //   if (newSettings && oldSettings && newSettings.systemInstruction !== oldSettings.systemInstruction) {
  //     // Optionally, inform the user or add a system message to current convo,
  //     // but it's generally better to just apply it silently on the next request.
  //     // showToastFn("System instructions updated globally.", "info");
  //   }
  // }, { deep: true });


  return {
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
    updateConversationTitle,
  };
}