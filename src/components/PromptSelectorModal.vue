<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out max-h-[85vh] flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="flex-shrink-0 flex justify-between items-center border-b dark:border-slate-700 p-5">
          <div class="flex items-center">
            <font-awesome-icon icon="lightbulb" class="mr-3 text-yellow-400 text-xl" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100">Chọn Prompt Mẫu</h3>
          </div>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <font-awesome-icon icon="times" size="lg" />
          </button>
        </div>

        <!-- Main Content Area: Tabs (Vertical) + Content -->
        <div class="flex-grow flex overflow-hidden">
          <!-- Vertical Tab Navigation -->
          <div v-if="categorizedPrompts && categorizedPrompts.length > 0" class="flex-shrink-0 w-56 border-r border-slate-200 dark:border-slate-700 overflow-y-auto minimalist-scrollbar">
            <nav class="flex flex-col space-y-1 p-3" aria-label="Tabs">
              <button
                v-for="category in categorizedPrompts"
                :key="category.name"
                @click="activeTab = category.name"
                :class="[
                  activeTab === category.name
                    ? 'bg-sky-100 dark:bg-sky-600/30 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400'
                    : 'border-transparent text-gray-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200',
                  'w-full text-left whitespace-nowrap py-2.5 px-3 border-l-4 font-medium text-sm rounded-r-md transition-all duration-150 ease-in-out focus:outline-none'
                ]"
              >
                {{ category.name }}
              </button>
            </nav>
          </div>

          <!-- Tab Content Area -->
          <div class="flex-grow p-5 overflow-y-auto minimalist-scrollbar">
            <div v-if="currentCategoryPrompts.length > 0" class="space-y-1">
              <div
                v-for="prompt in currentCategoryPrompts" :key="prompt.text"
                @click="selectPrompt(prompt.text)"
                class="p-2.5 cursor-pointer rounded-md hover:bg-sky-100 dark:hover:bg-sky-700/50 text-gray-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 text-sm transition-colors duration-150 ease-in-out group"
              >
                <span v-if="prompt.text.includes(':')">
                  <span class="font-medium">{{ prompt.text.split(':')[0] }}:</span>
                  {{ prompt.text.substring(prompt.text.indexOf(':') + 1) }}
                </span>
                <span v-else>{{ prompt.text }}</span>
              </div>
            </div>
            <div v-else-if="activeTab && categorizedPrompts.length > 0" class="text-center py-10 text-slate-500 dark:text-slate-400">
              Không có gợi ý nào trong danh mục "{{ activeTab }}".
            </div>
            <div v-else class="flex items-center justify-center h-full text-center py-10 text-slate-500 dark:text-slate-400">
              Chưa có prompt mẫu nào được cung cấp.
            </div>
          </div>
        </div>
  
        <!-- Footer -->
        <div class="flex-shrink-0 mt-auto p-5 border-t dark:border-slate-700 flex justify-end">
          <button @click="$emit('close')" class="px-5 py-2.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 text-sm font-medium transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watchEffect, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
    categorizedPrompts: {
      type: Array,
      default: () => [
        {
          name: 'Học Tập & Nghiên Cứu',
          prompts: [
            { text: 'Tìm hiểu sâu về: [chủ đề cụ thể]' },
            { text: 'Giải thích khái niệm: [thuật ngữ] một cách đơn giản' },
            { text: 'So sánh chi tiết: [A] và [B] dựa trên [tiêu chí]' },
            { text: 'Tóm tắt ý chính của bài viết/tài liệu sau: [dán link hoặc nội dung]' },
            { text: 'Lên dàn ý chi tiết cho bài luận về: [chủ đề]' },
          ],
        },
        {
          name: 'Sáng Tạo Nội Dung',
          prompts: [
            { text: 'Viết một bài blog khoảng 500 từ về: [chủ đề] với giọng văn [phong cách]' },
            { text: 'Tạo kịch bản video ngắn (30 giây) giới thiệu: [sản phẩm/dịch vụ]' },
            { text: 'Đề xuất 5 ý tưởng tiêu đề hấp dẫn cho bài viết về: [chủ đề]' },
            { text: 'Sáng tác một đoạn thơ ngắn (4 câu) về: [chủ đề]' },
            { text: 'Viết một câu chuyện ngắn có yếu tố: [bất ngờ/hài hước/cảm động] về [nhân vật/bối cảnh]' },
          ],
        },
        { name: 'Lập Trình & IT', prompts: [ { text: 'Viết code: [chức năng] bằng ngôn ngữ [Python/JavaScript/Java...]' }, { text: 'Giải thích đoạn code sau: [dán đoạn code vào đây]' } ]},
        { name: 'Công Việc & Năng Suất', prompts: [ { text: 'Soạn email chuyên nghiệp trả lời khách hàng về: [vấn đề]' }, { text: 'Lên kế hoạch chi tiết cho buổi họp nhóm về: [dự án/vấn đề]' } ]},
        { name: 'Giải Trí & Khác', prompts: [ { text: 'Kể một câu chuyện hài hước dựa trên tình huống: [tình huống oái oăm]' }, { text: 'Đề xuất một bộ phim thể loại [hành động/tình cảm/kinh dị] đáng xem cuối tuần này' } ]},
        { name: 'Mới & Nổi Bật', prompts: [] },
        { name: 'Danh mục dài 1', prompts: [{text: 'Prompt 1.1'}, {text: 'Prompt 1.2'}] },
        { name: 'Danh mục dài 2', prompts: [{text: 'Prompt 2.1'}] },
        { name: 'Danh mục dài 3', prompts: [] },
        { name: 'Danh mục dài 4', prompts: [{text: 'Prompt 4.1'}, {text: 'Prompt 4.2'}, {text: 'Prompt 4.3'}] },
        { name: 'Danh mục dài 5', prompts: [{text: 'Prompt 5.1'}] },
      ],
    },
  });
  
  const emit = defineEmits(['close', 'promptSelected']);
  
  const activeTab = ref('');
  
  watchEffect(() => {
    const promptsList = props.categorizedPrompts;
    if (props.isOpen) { 
      if (promptsList && promptsList.length > 0) {
        const currentTabIsValid = promptsList.some(category => category.name === activeTab.value);
        if (!activeTab.value || !currentTabIsValid) {
          activeTab.value = promptsList[0].name;
        }
      } else {
        activeTab.value = ''; 
      }
    }
  });
  
  const currentCategoryPrompts = computed(() => {
    if (!activeTab.value || !props.categorizedPrompts) return [];
    const currentCategory = props.categorizedPrompts.find(cat => cat.name === activeTab.value);
    return currentCategory ? currentCategory.prompts : [];
  });
  
  const selectPrompt = (promptText) => {
    emit('promptSelected', promptText);
    emit('close');
  };
  </script>
  
  <style scoped>
  .minimalist-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .minimalist-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .minimalist-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1; /* slate-300 */
    border-radius: 3px;
  }
  .dark .minimalist-scrollbar::-webkit-scrollbar-thumb {
    background-color: #475569; /* slate-600 */
  }
  
  .minimalist-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8; /* slate-400 */
  }
  .dark .minimalist-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #64748b; /* slate-500 */
  }
  
  .minimalist-scrollbar::-webkit-scrollbar-button {
    display: none;
  }

  .minimalist-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent; /* Light mode: thumb (slate-300), track (transparent) */
  }
  
  .dark .minimalist-scrollbar {
    scrollbar-color: #475569 transparent; /* Dark mode: thumb (slate-600), track (transparent) */
  }
  </style>