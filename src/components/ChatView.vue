<template>
  <div class="flex flex-col h-full"> <!-- Overall ChatView container -->
    <!-- Header (existing) -->
    <header class="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between shrink-0">
      <div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
          {{ chatTitle }}
        </h1>
        <div class="text-xs text-gray-500 dark:text-slate-400">
          Model: {{ currentModelDisplayName }}
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <ModelSelector
          v-if="apiKeyPresent && availableModels.length > 0"
          :current-model="currentConversation?.model"
          :available-models="availableModels"
          :getModelDisplayNameExt="props.getModelDisplayNameExt"
          @update:current-model="handleModelUpdate"
        />
        <button class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
          <font-awesome-icon icon="ellipsis-h" class="text-gray-400 dark:text-slate-500" />
        </button>
      </div>
    </header>

    <!-- Main Content Area (potentially split) -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Chat Messages & Input Area -->
      <div
        class="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        :class="[isPreviewPaneOpen ? 'w-[60%] sm:w-1/2' : 'w-full']"
      >
          <div
            v-if="!apiKeyPresent || (!currentConversation && apiKeyPresent)"
            class="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 pt-4 md:pt-6 pb-0"
          >
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 text-white text-3xl">
              <font-awesome-icon icon="robot" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-3">
              {{ !apiKeyPresent ? 'Vui lòng cấu hình API Key' : 'Chào mừng đến với Gemini WebUI!' }}
            </h1>
            <p class="text-gray-600 dark:text-slate-300 mb-8 max-w-md">
              {{ !apiKeyPresent ? 'Mở Cài đặt để thêm API Key và bắt đầu.' : 'Chọn một cuộc trò chuyện hoặc bắt đầu một cuộc trò chuyện mới.' }}
            </p>
          </div>
          <div
            v-else-if="currentConversation"
            ref="chatMessagesContainerRef"
            class="flex-1 overflow-y-auto no-scrollbar space-y-4 px-4 md:px-6 pt-4 md:pt-6 pb-0"
          >
            <MessageBubble
              v-for="msg in currentConversation.messages"
              :key="msg.id"
              :message="msg"
              @preview-html="handlePreviewHtmlRequest"
            />
            <div v-if="isLoadingIndicator" class="flex items-start space-x-3 py-1 justify-start w-[90%] mx-auto">
              <div class="message-avatar message-avatar-ai"><font-awesome-icon icon="robot" /></div>
              <div class="p-3 message-bubble message-bubble-ai">
                  <div class="flex items-center space-x-1.5">
                      <div v-for="i in 3" :key="i" class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" :style="{ animationDelay: `${(i-1) * 0.15}s` }"></div>
                  </div>
              </div>
            </div>
          </div>
        <!-- Input Area -->
        <div class="shrink-0 px-4 md:px-6 pt-0 pb-4 w-[90%] mx-auto" v-if="apiKeyPresent">
            <!-- Image Preview (existing) -->
            <div v-if="attachedFilePreview" class="mb-3 relative max-w-[150px] max-h-[100px]">
              <img :src="attachedFilePreview" alt="Selected Image" class="max-w-full max-h-[100px] rounded-lg border border-gray-300 dark:border-slate-600" />
              <button @click="removeAttachedFile" title="Xoá ảnh" class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                <font-awesome-icon icon="times" />
              </button>
            </div>
            <!-- Main Input Container (existing) -->
            <div class="new-input-container">
              <div class="input-wrapper">
                <textarea
                  v-model="messageInput"
                  placeholder="Nhập tin nhắn của bạn ở đây..."
                  class="message-input"
                  rows="1"
                  @keypress.enter.exact.prevent="submitSendMessage"
                  @input="adjustTextareaHeight"
                  @paste="handlePaste"
                  ref="textareaRef"
                  :disabled="isLoadingIndicator"
                ></textarea>
                <button
                  @click="submitSendMessage"
                  :disabled="isLoadingIndicator || (!messageInput.trim() && !attachedFile)"
                  class="send-button"
                >
                  <span v-if="isLoadingIndicator" class="loading-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </span>
                  <font-awesome-icon
                    v-else
                    class="text-base"
                    icon="paper-plane"
                  />
                </button>
              </div>
              <div class="action-bar">
                <div class="flex items-center space-x-4">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    class="hidden"
                    @change="handleFileSelect"
                    ref="imageUploadRef"
                  />
                  <button @click="triggerImageUpload" class="action-button" :disabled="isLoadingIndicator" title="Đính kèm ảnh">
                    <font-awesome-icon icon="paperclip" /> <span>Đính kèm tệp</span>
                  </button>
                  <button class="action-button" :disabled="isLoadingIndicator" title="Tin nhắn tự động">
                    <font-awesome-icon icon="microphone" /> <span>Ghi âm</span>
                  </button>
                  <button class="action-button" :disabled="isLoadingIndicator" title="Duyệt prompts" @click="isPromptModalOpen = true">
                    <font-awesome-icon icon="search" /> <span>Prompt mẫu</span>
                  </button>
                </div>
                <div class="character-count">{{ messageInput.length }}/3,000</div>
              </div>
            </div>
        </div>
      </div>

      <!-- HTML Preview Pane (Conditionally rendered on the right) -->
      <div
        v-if="isPreviewPaneOpen"
        class="flex flex-col border-l border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out"
        :class="[isPreviewPaneOpen ? 'w-[40%] sm:w-1/2' : 'w-0 opacity-0']"
      >
        <!-- Preview Header -->
        <div class="flex items-center justify-between p-2 sm:p-3 border-b dark:border-slate-600 shrink-0 h-[58px] sm:h-[61px]">
          <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-slate-100 flex items-center">
            <font-awesome-icon icon="code" class="mr-2 text-blue-500" /> Preview
          </h3>
          <div class="flex items-center space-x-1 sm:space-x-2">
             <label title="Include Tailwind CSS from CDN" class="flex items-center space-x-1 cursor-pointer text-xs text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
                <input
                  type="checkbox"
                  v-model="previewPaneUseTailwindCDN"
                  @change="updatePreviewIframeContent"
                  class="form-checkbox h-3.5 w-3.5 rounded text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-0 dark:focus:ring-offset-slate-800"
                />
                <span class="hidden sm:inline">Tailwind</span>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 sm:hidden"><path d="M10.75 10.818L8.066 3.75A2.25 2.25 0 005.93 2.56L2.452 3.71A.75.75 0 002 4.452v3.975A.75.75 0 002.452 9.4L5.93 10.558a2.25 2.25 0 002.136-1.232l.005-.01 1.269-2.96A.75.75 0 0110.033 6h4.099a.75.75 0 01.69.458l1.834 3.986a2.25 2.25 0 00-.283 4.083L12.38 17.5H10.5a.75.75 0 01-.75-.75V16a.75.75 0 00-.75-.75h-1.5A.75.75 0 006.75 16v.75a.75.75 0 01-.75.75H4.563A2.25 2.25 0 012.406 15.5H2a.75.75 0 01-.75-.75V11a.75.75 0 01.75-.75h.563a2.25 2.25 0 002.197-1.542L6.005 6.28a.75.75 0 011.38.588l-1.25 2.425A2.25 2.25 0 007.19 11.64l2.75 1.031a.75.75 0 01.31.933A2.25 2.25 0 0012.38 16h2.095a2.25 2.25 0 002.148-1.682l1.833-3.986a.75.75 0 01-.69-.458H14a.75.75 0 01-.728-.545L10.75 10.818z"></path></svg>
              </label>
            <button @click="closePreviewPane" title="Close Preview" class="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
              <font-awesome-icon icon="times" class="text-gray-500 dark:text-slate-400 h-4 w-4" />
            </button>
          </div>
        </div>
        <!-- Preview Iframe -->
        <div class="flex-1 overflow-hidden bg-gray-50 dark:bg-slate-900/70">
          <iframe
            ref="previewIframeRef"
            class="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="HTML Preview Content"
          ></iframe>
        </div>
      </div>
    </div>
    <PromptSelectorModal
      :isOpen="isPromptModalOpen"
      @close="isPromptModalOpen = false"
      @promptSelected="handlePromptSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import MessageBubble from './MessageBubble.vue';
import ModelSelector from './ModelSelector.vue';
import PromptSelectorModal from './PromptSelectorModal.vue';
import { useNotifications } from '@/composables/useNotifications';
// FontAwesomeIcon might be needed for the preview pane header if not globally registered
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  currentConversation: Object,
  apiKeyPresent: Boolean,
  isLoadingIndicator: Boolean,
  availableModels: Array,
  getModelDisplayNameExt: Function,
  activeModelId: String,
});

const emit = defineEmits(['sendMessage', 'modelChanged']);

const { showToast } = useNotifications();

const messageInput = ref('');
const attachedFile = ref(null);
const attachedFilePreview = ref(null);
const isPromptModalOpen = ref(false);
const textareaRef = ref(null);
const imageUploadRef = ref(null);
const chatMessagesContainerRef = ref(null);

// --- State for HTML Preview Pane ---
const isPreviewPaneOpen = ref(false);
const previewPaneHtmlContent = ref('');
const previewPaneUseTailwindCDN = ref(true); // Default to true
const previewIframeRef = ref(null);
// --- End State for HTML Preview Pane ---

const chatTitle = computed(() => props.currentConversation?.title || 'AI Chat');
const currentModelDisplayName = computed(() => {
    if (props.activeModelId && props.getModelDisplayNameExt) {
        return props.getModelDisplayNameExt(props.activeModelId);
    } else if (props.availableModels?.length > 0 && props.getModelDisplayNameExt) {
        return props.getModelDisplayNameExt(props.availableModels[0].value);
    }
    return "Loading...";
});

const isModelMultimodal = (modelId) => {
    return ["flash", "vision", "1.5-pro", "gemma"].some(term => modelId?.includes(term));
};

const adjustTextareaHeight = () => { /* ... existing ... */
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    let newHeight = Math.min(textareaRef.value.scrollHeight, 120);
    textareaRef.value.style.overflowY = newHeight === 120 ? 'auto' : 'hidden';
    textareaRef.value.style.height = `${newHeight}px`;
  }
};
const scrollToBottom = () => { /* ... existing ... */
  nextTick(() => {
    if (chatMessagesContainerRef.value) {
      chatMessagesContainerRef.value.scrollTop = chatMessagesContainerRef.value.scrollHeight;
    }
  });
};

watch(() => props.currentConversation?.messages, scrollToBottom, { deep: true });
watch(() => props.isLoadingIndicator, (newVal) => { if(newVal) scrollToBottom(); });


// --- HTML Preview Pane Logic ---
const handlePreviewHtmlRequest = (htmlContent) => {
  previewPaneHtmlContent.value = htmlContent;
  if (!isPreviewPaneOpen.value) {
      isPreviewPaneOpen.value = true;
  }
  nextTick(updatePreviewIframeContent);
};

const closePreviewPane = () => {
  isPreviewPaneOpen.value = false;
  if (previewIframeRef.value) {
    previewIframeRef.value.srcdoc = 'about:blank';
  }
};

const getAppThemeClassForIframe = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : '';
};

const updatePreviewIframeContent = () => {
  if (!previewIframeRef.value || !isPreviewPaneOpen.value) return;

  const currentAppTheme = getAppThemeClassForIframe();
  const completeHtml = `
    <!DOCTYPE html>
    <html lang="en" class="${currentAppTheme}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview</title>
      ${previewPaneUseTailwindCDN.value ? '<script src="https://cdn.tailwindcss.com"><\/script>' : ''}
      ${previewPaneUseTailwindCDN.value && currentAppTheme === 'dark' ? `
      <script>
      <\/script>
      ` : ''}
      <style>
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          background-color: ${currentAppTheme === 'dark' ? '#1e293b' : '#ffffff'}; 
          color: ${currentAppTheme === 'dark' ? '#cbd5e1' : '#374151'}; 
          padding: 1rem;
          box-sizing: border-box;
          word-wrap: break-word; 
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${currentAppTheme === 'dark' ? '#0f172a' : '#e5e7eb'}; } 
        ::-webkit-scrollbar-thumb { background: ${currentAppTheme === 'dark' ? '#334155' : '#a1a1aa'}; border-radius: 4px; } 
        ::-webkit-scrollbar-thumb:hover { background: ${currentAppTheme === 'dark' ? '#475569' : '#71717a'}; } 
      </style>
    </head>
    <body>
      ${previewPaneHtmlContent.value || '<p style="color: #9ca3af; text-align: center; margin-top: 2rem;">(No content to preview)</p>'}
    </body>
    </html>
  `;
  try {
    previewIframeRef.value.srcdoc = completeHtml;
  } catch (e) {
    console.error("Error setting srcdoc:", e);
    previewIframeRef.value.srcdoc = `<html><body>Error displaying preview. See console.</body></html>`;
  }
};

watch(previewPaneUseTailwindCDN, updatePreviewIframeContent);
watch(previewPaneHtmlContent, (newVal) => {
    if(isPreviewPaneOpen.value) { 
        updatePreviewIframeContent();
    }
});
watch(isPreviewPaneOpen, (isOpen) => {
    if(isOpen && previewPaneHtmlContent.value) {
        nextTick(updatePreviewIframeContent); 
    }
});

let iframeThemeObserver = null;

const handleFileSelect = (event) => { 
  const file = event.target.files[0];
  if (!file) return;

  if (!props.apiKeyPresent) {
    showToast('Vui lòng cung cấp API Key trong Cài đặt.', 'warn');
    imageUploadRef.value.value = '';
    return;
  }

  const currentModel = props.currentConversation?.model || props.availableModels[0]?.value;
  if (!isModelMultimodal(currentModel)) {
    showToast(`Model "${props.getModelDisplayNameExt(currentModel)}" không hỗ trợ ảnh.`, 'warn');
    imageUploadRef.value.value = '';
    return;
  }
  if (!file.type.startsWith("image/")) {
    showToast("Chỉ chấp nhận tệp ảnh (PNG, JPG, WEBP, GIF).", "warn");
    imageUploadRef.value.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    attachedFile.value = {
      mimeType: file.type,
      data: e.target.result.split(",")[1],
      name: file.name,
      previewUrl: e.target.result,
    };
    attachedFilePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  imageUploadRef.value.value = '';
};
const handlePaste = (event) => { 
  const items = event.clipboardData?.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          event.preventDefault();
          const syntheticEvent = { target: { files: [file] } };
          handleFileSelect(syntheticEvent);
          break;
        }
      }
    }
  }
};
const removeAttachedFile = () => { 
  attachedFile.value = null;
  attachedFilePreview.value = null;
};
const triggerImageUpload = () => { 
  imageUploadRef.value?.click();
};
const submitSendMessage = () => { 
  const text = messageInput.value.trim();
  if ((!text && !attachedFile.value) || props.isLoadingIndicator) return;

  emit('sendMessage', { text, file: attachedFile.value });
  messageInput.value = '';
  removeAttachedFile();
  adjustTextareaHeight();
  nextTick(() => textareaRef.value?.focus());
};
const handleModelUpdate = (newModel) => { 
    emit('modelChanged', newModel);
    if (attachedFile.value && !isModelMultimodal(newModel)) {
        removeAttachedFile();
        showToast("Ảnh đính kèm đã được xoá do model mới không hỗ trợ.", "info");
    }
};
const handlePromptSelected = (prompt) => { 
  messageInput.value = prompt;
  isPromptModalOpen.value = false;
  nextTick(() => textareaRef.value?.focus());
};

defineExpose({
    focusInput: () => textareaRef.value?.focus()
});

onMounted(()=>{
    if(props.apiKeyPresent){
        textareaRef.value?.focus();
    }
    if (typeof MutationObserver !== 'undefined') {
        iframeThemeObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (isPreviewPaneOpen.value) { 
                nextTick(updatePreviewIframeContent);
            }
            }
        }
        });
        iframeThemeObserver.observe(document.documentElement, { attributes: true });
    }
});

onUnmounted(() => {
  if (iframeThemeObserver) {
    iframeThemeObserver.disconnect();
  }
});

</script>

<style scoped>
/* Existing styles for .new-input-container, .input-wrapper, etc. should remain */
.new-input-container {
  @apply bg-white dark:bg-slate-800 rounded-3xl shadow-sm overflow-hidden;
  border: 2px solid transparent;
  background-clip: padding-box; 
  transition: all 0.2s ease;
}

.new-input-container:not(:focus-within) {
  @apply border-gray-200 dark:border-slate-600;
  background-image: none; 
}

.new-input-container:focus-within {
  border: 2px solid transparent; 
  background-clip: padding-box, border-box; 
  background-origin: padding-box, border-box; 
  background-image:
    linear-gradient(to right, white, white), 
    linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080); 
  background-size: 100% 100%, 400% 100%; 
  animation: rainbow-border 10s linear infinite; 
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); 
}

.dark .new-input-container:focus-within {
  background-image:
    linear-gradient(to right, #1e293b, #1e293b), 
    linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080); 
}

@keyframes rainbow-border {
  0% {
    background-position: 0% 50%, 0% 50%;
  }
  100% {
    background-position: 0% 50%, calc(400% / 3) 50%;
  }
}

.input-wrapper {
  @apply flex items-end p-3 pb-2;
}

.message-input {
  @apply flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-slate-100 resize-none text-base;
  @apply placeholder-gray-500 dark:placeholder-slate-400;
  min-height: 24px;
  max-height: 120px;
  line-height: 1.5;
}

.send-button {
  @apply w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-600;
  @apply rounded-full flex items-center justify-center text-white ml-3 shrink-0;
  @apply transition-all duration-200 transform;
}

.send-button:hover:not(:disabled) {
  @apply scale-105;
}

.send-button:active:not(:disabled) {
  @apply scale-95;
}

.action-bar {
  @apply flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-slate-700;
  @apply bg-gray-50/50 dark:bg-slate-700/30;
}

.action-button {
  @apply flex items-center space-x-1.5 text-gray-600 dark:text-slate-400;
  @apply hover:text-gray-800 dark:hover:text-slate-200 text-sm;
  @apply transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  @apply px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600;
}

.character-count {
  @apply text-xs text-gray-400 dark:text-slate-500 font-mono;
}

@media (max-width: 640px) {
  .action-bar {
    @apply flex-col space-y-2 items-stretch;
  }
  .action-button span { @apply hidden; }
  .character-count { @apply text-center; }
}

/* New styles for loading dots */
.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.dot {
  width: 6px;
  height: 6px;
  margin: 0 1px;
  background-color: white;
  border-radius: 50%;
  opacity: 0;
  animation: fade-dots 1.2s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes fade-dots {
  0%, 80%, 100% { opacity: 0; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}
</style>