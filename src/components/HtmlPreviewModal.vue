<template>
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4" @mousedown.self="$emit('close')">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between p-3 sm:p-4 border-b dark:border-slate-700 shrink-0">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100">HTML Preview</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="toggleToolbar"
              class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-xs sm:text-sm text-gray-600 dark:text-slate-300"
              :title="showToolbar ? 'Hide Toolbar' : 'Show Toolbar'"
            >
              <font-awesome-icon :icon="showToolbar ? 'chevron-up' : 'chevron-down'" class="mr-1" />
              Toolbar
            </button>
            <button @click="$emit('close')" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
              <font-awesome-icon icon="times" class="text-gray-500 dark:text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
  
        <div
          v-if="showToolbar"
          class="p-2 sm:p-3 bg-gray-50 dark:bg-slate-700/50 border-b dark:border-slate-700 text-xs sm:text-sm text-gray-700 dark:text-slate-200 shrink-0"
        >
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="useTailwindCDN"
              @change="updatePreview"
              class="form-checkbox h-4 w-4 rounded text-blue-600 dark:text-blue-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-0 dark:focus:ring-offset-slate-800"
            />
            <span>Include Tailwind CSS (via CDN for snippets)</span>
          </label>
          <p class="mt-1 text-gray-500 dark:text-slate-400 text-xs">
            Enable this if your HTML snippet uses Tailwind classes and doesn't include Tailwind itself.
          </p>
        </div>
  
        <div class="flex-1 overflow-hidden bg-gray-100 dark:bg-slate-900">
          <iframe
            ref="previewIframe"
            class="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="HTML Preview Content"
          ></iframe>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Ensure FA is set up
  
  const props = defineProps({
    isOpen: Boolean,
    htmlContent: String,
  });
  const emit = defineEmits(['close']);
  
  const previewIframe = ref(null);
  const useTailwindCDN = ref(true);
  const showToolbar = ref(true);
  
  const toggleToolbar = () => {
    showToolbar.value = !showToolbar.value;
  };
  
  const getAppThemeClass = () => {
    return document.documentElement.classList.contains('dark') ? 'dark' : '';
  };
  
  const updatePreview = () => {
    if (!previewIframe.value) return;
  
    if (props.isOpen && props.htmlContent != null) {
      const currentAppTheme = getAppThemeClass();
      // Basic HTML structure for the iframe
      const completeHtml = `
        <!DOCTYPE html>
        <html lang="en" class="${currentAppTheme}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          ${useTailwindCDN.value ? '<script src="https://cdn.tailwindcss.com"><\/script>' : ''}
          ${useTailwindCDN.value && currentAppTheme === 'dark' ? `
          <script>
            if (typeof tailwind !== 'undefined' && tailwind.config) {
              // Tailwind CDN applies dark mode based on the class on <html>
              // This script ensures that if the CDN is loaded and the mode is dark,
              // it respects the 'class' strategy.
              // For Tailwind v3 CDN, it usually auto-detects 'dark' class on <html>.
              // You might need to configure it if issues arise:
              // tailwind.config = { darkMode: 'class', theme: { extend: {} }, plugins: [] };
            }
          <\/script>
          ` : ''}
          <style>
            /* Base styles for the iframe body to match app theme */
            body {
              margin: 0;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
              background-color: ${currentAppTheme === 'dark' ? '#0f172a' : '#f3f4f6'}; /* slate-900 or gray-100 */
              color: ${currentAppTheme === 'dark' ? '#e2e8f0' : '#1f2937'}; /* slate-200 or gray-800 */
              padding: 1rem; /* Add some padding to content */
              box-sizing: border-box;
            }
            /* Handle potential scrollbars in dark mode */
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: ${currentAppTheme === 'dark' ? '#1e293b' : '#e5e7eb'}; }
            ::-webkit-scrollbar-thumb { background: ${currentAppTheme === 'dark' ? '#475569' : '#9ca3af'}; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: ${currentAppTheme === 'dark' ? '#64748b' : '#6b7280'}; }
          </style>
        </head>
        <body>
          ${props.htmlContent}
        </body>
        </html>
      `;
      previewIframe.value.srcdoc = completeHtml;
    } else {
      // Clear iframe if modal is open but no content, or if modal is closing
      previewIframe.value.srcdoc = `
        <!DOCTYPE html><html lang="en" class="${getAppThemeClass()}">
        <head><meta charset="UTF-8"><title>Preview</title>
        <style>body{margin:0; background-color: ${getAppThemeClass() === 'dark' ? '#0f172a' : '#f3f4f6'};}</style>
        </head><body></body></html>`;
    }
  };
  
  watch(() => [props.isOpen, props.htmlContent, useTailwindCDN.value], () => {
    if (props.isOpen) {
      nextTick(updatePreview);
    } else if (previewIframe.value) {
      // Clear srcdoc when closing to free up resources and prevent flicker
       previewIframe.value.srcdoc = 'about:blank';
    }
  }, { immediate: true, deep: true });
  
  
  // Observe main document theme changes and update iframe
  let themeObserver = null;
  onMounted(() => {
    if (typeof MutationObserver !== 'undefined') {
      themeObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (props.isOpen) {
              // Theme changed, update preview if it's open
              nextTick(updatePreview);
            }
          }
        }
      });
      themeObserver.observe(document.documentElement, { attributes: true });
    }
  });
  
  onUnmounted(() => {
    if (themeObserver) {
      themeObserver.disconnect();
    }
  });
  
  </script>