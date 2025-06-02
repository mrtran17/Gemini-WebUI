<template>
  <header class="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between shrink-0">
    <div>
      <h1 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
        AI Giải Toán
      </h1>
      <div class="text-xs text-gray-500 dark:text-slate-400">
        Model: gemini-2.5-flash-preview-05-20 (Fixed)
      </div>
    </div>
    <!-- Model selector removed -->
    <div>
      <!-- Placeholder for potential future actions, currently empty -->
    </div>
  </header>
  <div class="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
    <div
      v-if="!props.apiKey || messages.length === 0"
      class="flex-1 flex flex-col items-center justify-center text-center"
    >
      <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 text-white text-3xl">
        <font-awesome-icon icon="calculator" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-3">
        {{ !props.apiKey ? 'Vui lòng cấu hình API Key' : 'Chào mừng đến với AI Giải Toán!' }}
      </h1>
      <p class="text-gray-600 dark:text-slate-300 mb-8 max-w-md">
        {{ !props.apiKey ? 'Mở Cài đặt để thêm API Key và bắt đầu.' : 'Nhập bài toán của bạn ở đây.' }}
      </p>
    </div>
<div
  v-else
  ref="chatMessagesContainerRef"
  class="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4"
>
    <MessageBubble
    v-for="msg in messages"
    :key="msg.id"
    :message="msg"
    />
    <div v-if="isLoadingIndicator" class="flex items-start space-x-3 py-1 justify-start">
        <div class="message-avatar message-avatar-ai"><font-awesome-icon icon="robot" /></div>
        <div class="p-3 message-bubble message-bubble-ai">
            <div class="flex items-center space-x-1.5">
                <div v-for="i in 3" :key="i" class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" :style="{ animationDelay: `${(i-1) * 0.15}s` }"></div>
            </div>
        </div>
    </div>
</div>

<div class="mt-auto pt-4 shrink-0" v-if="props.apiKey">
  <!-- Image Preview -->
  <div v-if="attachedFilePreview" class="mb-3 relative max-w-[150px] max-h-[100px]">
    <img :src="attachedFilePreview" alt="Selected Image" class="max-w-full max-h-[100px] rounded-lg border border-gray-300 dark:border-slate-600" />
    <button @click="removeAttachedFile" title="Xoá ảnh" class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center cursor-pointer shadow-lg transition-colors">
      <font-awesome-icon icon="times" />
    </button>
  </div>

  <!-- Main Input Container -->
  <div class="new-input-container">
    <div class="input-wrapper">
      <textarea
        v-model="messageInput"
        placeholder="Nhập bài toán của bạn ở đây..."
        class="message-input"
        rows="1"
        @keypress.enter.exact.prevent="submitSendMessage"
        @input="adjustTextareaHeight"
        ref="textareaRef"
        :disabled="isLoadingIndicator"
      ></textarea>
      <button
        @click="submitSendMessage"
        :disabled="isLoadingIndicator || (!messageInput.trim() && !attachedFile)"
        class="send-button"
      >
        <font-awesome-icon 
          class="text-base" 
          :icon="isLoadingIndicator ? 'spinner' : 'paper-plane'" 
          :spin="isLoadingIndicator" 
        />
      </button>
    </div>
    
    <!-- Bottom Action Bar - Only include image attachment -->
    <div class="action-bar">
      <div class="flex items-center space-x-4">
        <input
          type="file"
          id="imageUploadMath"
          accept="image/png, image/jpeg, image/webp, image/gif"
          class="hidden"
          @change="handleFileSelect"
          ref="imageUploadRef"
        />
        <button
          @click="triggerImageUpload"
          class="action-button"
          :disabled="isLoadingIndicator"
          title="Đính kèm ảnh bài toán"
        >
          <font-awesome-icon icon="paperclip" />
          <span>Attach Image</span>
        </button>
        
        <!-- Other action buttons removed -->
      </div>
      
      <div class="character-count">
        {{ messageInput.length }}/3,000
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import MessageBubble from '../components/MessageBubble.vue';
// ModelSelector removed
import { useNotifications } from '@/composables/useNotifications';

const props = defineProps({
  apiKey: String, // Expecting API key as a prop
});

// Removed emit for modelChanged
const emit = defineEmits(['sendMessage']);

const { showToast } = useNotifications();

const messageInput = ref('');
const attachedFile = ref(null);
const attachedFilePreview = ref(null);
const messages = ref([]); // Local messages state for this view
const isLoadingIndicator = ref(false); // Local loading state

const textareaRef = ref(null);
const imageUploadRef = ref(null);
const chatMessagesContainerRef = ref(null);

// Fixed model for math solver
const MATH_SOLVER_MODEL = 'gemini-2.5-flash-preview-05-20';
const SYSTEM_INSTRUCTION = "Bạn là nhà toán học chuyên nghiệp, tất cả những dự liệu, promt tôi gửi cho bạn nếu không phải 1 bài toán hoặc liên quan đến toán thì bạn hãy trả lời là không liên quan đến toán hoặc không phải bài toán thì không trả lời thêm";

// chatTitle and currentModelDisplayName computed properties removed

const isModelMultimodal = (modelId) => {
    // This view only uses a multimodal model, but keep check for robustness
    return ["flash", "vision", "1.5-pro", "gemma"].some(term => modelId?.includes(term));
};

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    let newHeight = Math.min(textareaRef.value.scrollHeight, 120);
    textareaRef.value.style.overflowY = newHeight === 120 ? 'auto' : 'hidden';
    textareaRef.value.style.height = `${newHeight}px`;
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesContainerRef.value) {
      chatMessagesContainerRef.value.scrollTop = chatMessagesContainerRef.value.scrollHeight;
    }
  });
};

watch(messages, scrollToBottom, { deep: true });
watch(isLoadingIndicator, (newVal) => { if(newVal) scrollToBottom(); });

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!props.apiKey) { // Use apiKey prop
    showToast('Vui lòng cung cấp API Key trong Cài đặt.', 'warn');
    imageUploadRef.value.value = '';
    return;
  }

  // Check if the fixed model supports images
  if (!isModelMultimodal(MATH_SOLVER_MODEL)) {
      showToast(`Model "${MATH_SOLVER_MODEL}" không hỗ trợ ảnh.`, 'warn');
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

const removeAttachedFile = () => {
  attachedFile.value = null;
  attachedFilePreview.value = null;
};

const triggerImageUpload = () => {
  imageUploadRef.value?.click();
};

const submitSendMessage = async () => {
  const text = messageInput.value.trim();
  if ((!text && !attachedFile.value) || isLoadingIndicator.value) return;

  if (!props.apiKey) {
      showToast('Vui lòng cung cấp API Key trong Cài đặt để sử dụng AI Giải Toán.', 'warn');
      return;
  }

  isLoadingIndicator.value = true; // Set loading true

  const userMessage = { // Create user message object
      id: Date.now() + '-user', // Simple unique ID
      role: 'user',
      parts: [],
  };

  if (text) {
      userMessage.parts.push({ text: text });
  }

  if (attachedFile.value) {
      userMessage.parts.push({
          inlineData: {
              mimeType: attachedFile.value.mimeType,
              data: attachedFile.value.data,
          },
      });
  }

  messages.value.push(userMessage); // Add user message to local state

  messageInput.value = '';
  removeAttachedFile();
  adjustTextareaHeight();
  nextTick(() => textareaRef.value?.focus());

  // Construct the message payload for the API, including the system instruction and history
  const history = messages.value.map(msg => ({
      role: msg.role,
      parts: msg.parts,
  }));

  const payload = {
      contents: history,
      system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      generationConfig: {},
      safetySettings: [],
  };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MATH_SOLVER_MODEL}:generateContent?key=${props.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            showToast(`API Error: ${errorData.error.message || response.statusText}`, 'error');
             const errorMessage = { // Create an error message object
                id: Date.now() + '-error',
                role: 'error',
                parts: [{ text: `Error: ${errorData.error.message || response.statusText}` }],
            };
            messages.value.push(errorMessage); // Add error message to local state
            isLoadingIndicator.value = false;
            return;
        }

        const responseData = await response.json();
        console.log('API Response:', responseData);

        const modelResponseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || 'Không nhận được phản hồi từ AI.';

        const apiResponse = { // Create a model response object
            id: Date.now() + '-model',
            role: 'model',
            parts: [{ text: modelResponseText }],
        };

        messages.value.push(apiResponse); // Add model response to local state

    } catch (error) {
        console.error('Fetch Error:', error);
        showToast(`Fetch Error: ${error.message}`, 'error');
         const errorMessage = { // Create a model response object
            id: Date.now() + '-error',
            role: 'error',
            parts: [{ text: `Fetch Error: ${error.message}` }],
        };
         messages.value.push(errorMessage); // Add error message to local state
    } finally {
        isLoadingIndicator.value = false; // Set loading false
    }
};

// handleModelUpdate removed

defineExpose({
    focusInput: () => textareaRef.value?.focus()
});

onMounted(()=>{
    if(props.apiKey){
        textareaRef.value?.focus();
    }
});

// Removed watch for currentConversation and isLoadingIndicator from ChatView as state is local

</script>

<style scoped>
/* Copy styles from ChatView.vue or refine as needed */
.new-input-container {
  @apply bg-white dark:bg-slate-800 rounded-3xl shadow-sm overflow-hidden;
  border: 2px solid transparent;
  background-clip: padding-box; /* Keep solid background within padding-box */
  transition: all 0.2s ease;
}

.new-input-container:not(:focus-within) {
  @apply border-gray-200 dark:border-slate-600;
  background-image: none; /* Ensure no gradient when not focused */
}

.new-input-container:focus-within {
  border: 2px solid transparent; /* Border provides the space for the gradient */
  background-clip: padding-box, border-box; /* Solid bg for content, gradient for border area */
  background-origin: padding-box, border-box; /* Align origins accordingly */
  background-image: 
    linear-gradient(to right, white, white), /* Solid background for content area (light mode) */
    linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080); /* Rainbow gradient */
  background-size: 100% 100%, 400% 100%; /* Solid bg covers element, gradient is 4x wide */
  animation: rainbow-border 10s linear infinite; /* Slower and continuous */
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); /* Optional: keep or adjust shadow */
}

.dark .new-input-container:focus-within {
  background-image: 
    linear-gradient(to right, #1e293b, #1e293b), /* Solid background for content area (dark mode) */
    linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080); /* Rainbow gradient */
}

@keyframes rainbow-border {
  0% {
    /* Position for solid bg (1st image), Position for gradient (2nd image) */
    background-position: 0% 50%, 0% 50%;
  }
  100% {
    /* Solid bg position unchanged. Gradient position moves by one full pattern width. */
    /* (400% / 3) makes the 400%-wide gradient scroll exactly its full width */
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .action-bar {
    @apply flex-col space-y-2 items-stretch;
  }
  
  .action-button span {
    @apply hidden;
  }
  
  .character-count {
    @apply text-center;
  }
}
</style> 