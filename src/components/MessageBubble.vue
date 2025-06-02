<template>
  <div ref="bubbleRef" class="flex items-start space-x-3 py-1" :class="wrapperClasses">
    <template v-if="message.role === 'user'">
      <div class="p-3 message-bubble message-bubble-user">
        <img v-if="imageUrl" :src="imageUrl" alt="Ảnh người dùng gửi" class="max-w-xs max-h-48 rounded mb-2 border dark:border-slate-600" />
        <div v-if="messageText" class="prose-chat" v-html="parsedMarkdown"></div>
      </div>
      <div class="message-avatar message-avatar-user">
        <font-awesome-icon icon="user" />
      </div>
    </template>

    <template v-else-if="message.role === 'model'">
      <div class="message-avatar message-avatar-ai">
        <font-awesome-icon icon="robot" />
      </div>
      <div class="p-3 message-bubble message-bubble-ai">
        <div class="prose-chat" v-html="parsedMarkdown"></div>
      </div>
    </template>

    <template v-else-if="message.role === 'system' || message.role === 'error'">
        <div class="text-xs italic px-3 py-1 rounded-md mx-auto" :class="systemMessageClasses">
            {{ messageText }}
        </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick, watch } from 'vue';
import { marked } from '@/utils/markdown';
import hljs from 'highlight.js';
import { useTheme } from '@/composables/useTheme';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['preview-html']);

const bubbleRef = ref(null);

const messageText = computed(() => {
    return props.message.parts?.find(p => p.text)?.text || '';
});

const imageUrl = computed(() => {
    return props.message.parts?.find(p => p.inlineData?.previewUrl)?.inlineData.previewUrl;
});

const wrapperClasses = computed(() => {
  switch (props.message.role) {
    case 'user': return ['justify-end', 'w-[90%]', 'mx-auto'];
    case 'model': return ['justify-start', 'w-[90%]', 'mx-auto'];
    case 'system': case 'error': return 'justify-center w-full';
    default: return '';
  }
});
const { isDarkMode } = useTheme();
const systemMessageClasses = computed(() => {
    const isDark = isDarkMode.value;
    if (props.message.role === 'system') {
        return isDark
            ? ['bg-slate-700', 'text-slate-300']
            : ['bg-slate-200', 'text-slate-600'];
    } else if (props.message.role === 'error') {
        return isDark
            ? ['bg-red-800/70', 'text-red-200', 'border', 'border-red-700']
            : ['bg-red-100', 'text-red-700', 'border', 'border-red-300'];
    }
    return [];
});
const parsedMarkdown = computed(() => {
    if (!messageText.value) return '';
    try {
        return marked.parse(messageText.value);
    } catch(e) {
        console.error("Markdown parsing error:", e);
        return `<pre>${messageText.value.replace(/</g, "<").replace(/>/g, ">")}</pre>`;
    }
});

const ICONS = {
  COPY: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" class="svg-inline--fa fa-copy fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>',
  CHECK: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"></path></svg>',
  TIMES: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path></svg>',
  EYE: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" class="svg-inline--fa fa-eye fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 158.8 17.3 201.8 0 256s17.3 97.2 47.4 143.4C94.5 443.2 159.2 480 288 480s145.5-36.8 192.6-80.6C529.4 353.2 560.7 310.2 576 256s-17.3-97.2-47.4-143.4C433.5 68.8 368.8 32 288 32zm264 224c-28.9 40.2-72.9 73.4-122.1 94.8-13.9 6-28.8 9.2-43.9 9.2s-30-3.2-43.9-9.2C199.9 429.4 156 396.2 127 356.1c.1-.1.1-.1 0 0C100.1 316.8 79.3 285.3 64 256c15.3-29.3 36.1-60.8 63-99.9.1-.1.1-.1 0 0 28.9-40.2 72.9-73.4 122.1-94.8 13.9-6 28.8-9.2 43.9-9.2s30 3.2 43.9 9.2c49.2 21.4 92.2 54.6 122.1 94.8 27.9 39.2 48.7 70.7 64 99.9-15.3 29.3-36.1 60.8-63 99.9zM288 112a144 144 0 1 0 0 288 144 144 0 1 0 0-288zm0 80a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg>',
};

const highlightCodeBlocks = () => {
  nextTick(() => {
    if (!bubbleRef.value) return;
    if (props.message.role === 'model' || (props.message.role === 'user' && messageText.value.includes('```'))) {
      bubbleRef.value.querySelectorAll('pre code').forEach((block) => {
        if (block.dataset.highlighted === 'true') return;

        hljs.highlightElement(block);
        block.dataset.highlighted = 'true';

        const pre = block.closest('pre');
        if (!pre) return;

        let buttonContainer = pre.querySelector('.code-button-container');
        if (!buttonContainer) {
          buttonContainer = document.createElement('div');
          buttonContainer.className = 'code-button-container';
          pre.insertBefore(buttonContainer, pre.firstChild);
          pre.style.position = 'relative';
        }

        if (!buttonContainer.querySelector('.copy-code-button')) {
          const btnCopy = document.createElement('button');
          btnCopy.className = 'code-action-button copy-code-button';
          btnCopy.innerHTML = `${ICONS.COPY} <span class="btn-text">Copy</span>`;
          btnCopy.title = 'Copy code';
          btnCopy.style.position = 'absolute';
          btnCopy.style.top = '0.5em';
          btnCopy.style.right = '0.5em';
          btnCopy.onclick = () => {
            navigator.clipboard.writeText(block.textContent || '')
              .then(() => {
                btnCopy.innerHTML = `${ICONS.CHECK} <span class="btn-text">Copied!</span>`;
                setTimeout(() => (btnCopy.innerHTML = `${ICONS.COPY} <span class="btn-text">Copy</span>`), 2000);
              })
              .catch(err => {
                console.error('Failed to copy code:', err);
                btnCopy.innerHTML = `${ICONS.TIMES} <span class="btn-text">Error</span>`;
                setTimeout(() => (btnCopy.innerHTML = `${ICONS.COPY} <span class="btn-text">Copy</span>`), 2000);
              });
          };
          buttonContainer.appendChild(btnCopy);
        }

        const lang = block.className.match(/language-(\S+)/);
        const isHtmlLike = lang && ['html', 'markup', 'xml', 'svg'].includes(lang[1]);

        if (isHtmlLike && !buttonContainer.querySelector('.preview-code-button')) {
          const btnPreview = document.createElement('button');
          btnPreview.className = 'code-action-button preview-code-button';
          btnPreview.innerHTML = `${ICONS.EYE} <span class="btn-text">Preview</span>`;
          btnPreview.title = 'Preview HTML/XML/SVG';
          btnPreview.style.position = 'absolute';
          btnPreview.style.top = '0.5em';
          btnPreview.style.right = '7em';
          btnPreview.onclick = () => {
            emit('preview-html', block.textContent || '');
          };
          buttonContainer.appendChild(btnPreview);
        }
      });
    }
  });
};

onMounted(highlightCodeBlocks);
watch(parsedMarkdown, highlightCodeBlocks, { flush: 'post' });
watch(() => props.message, highlightCodeBlocks, { deep: true, flush: 'post' });

</script>

<style>
.prose-chat pre {
  position: relative;
  padding-top: 3em !important;
  box-sizing: border-box;
}

.code-button-container {
  box-sizing: border-box;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  z-index: 10;
}

.code-action-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.30rem 0.6rem;
  background-color: rgba(75, 85, 99, 0.75);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
  opacity: 0.85;
  transition: opacity 0.2s, background-color 0.2s;
  white-space: nowrap;
}

.copy-code-button {
  margin-right: 0.5em !important;
}

.dark .code-action-button {
  background-color: rgba(55, 65, 81, 0.75);
}

.code-action-button:hover {
  opacity: 1;
  background-color: rgba(55, 65, 81, 0.95);
}
.dark .code-action-button:hover {
  background-color: rgba(30, 41, 59, 0.95);
}

.preview-code-button {
  margin-right: 1em !important;
}

.code-action-button svg {
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.3rem;
}

.message-bubble {
  @apply rounded-xl p-4;
}
</style>