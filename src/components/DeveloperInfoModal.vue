<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
    :class="isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    @click.self="closeModal"
  >
    <div
      v-if="isOpen"
      class="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-xl shadow-2xl w-full max-w-md border dark:border-slate-700 flex flex-col max-h-[90vh] transform transition-all duration-300 ease-in-out"
      :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
    >
      <div class="flex justify-between items-center mb-5 md:mb-6 pb-3 border-b dark:border-slate-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100">
          <font-awesome-icon icon="info-circle" class="mr-2 text-blue-500" />Thông tin Nhà phát triển
        </h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <font-awesome-icon icon="times" class="text-2xl" />
        </button>
      </div>

      <div class="overflow-y-auto space-y-5 md:space-y-6 pr-1 md:pr-2 no-scrollbar flex-grow custom-scrollbar">
        <div class="text-center">
          <img
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTORR2uMHZNyzpEZwiAaQc5TC2szCCBY_z828Q6giqR28C6syDol-_HxF11QJMWF4tXtglnshoDuQlFpliN6uD5ug"
            alt="Trần Hữu Phước"
            class="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-blue-500 dark:border-blue-400"
          />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-slate-200">Trần Hữu Phước</h3>
          <p class="text-sm text-gray-600 dark:text-slate-400">Vibe Coder</p>
        </div>

        <div class="space-y-3">
          <h4 class="text-md font-semibold text-gray-700 dark:text-slate-300 border-b dark:border-slate-700 pb-1 mb-2">
            <font-awesome-icon icon="link" class="mr-2 text-indigo-500" />Kết nối với tôi
          </h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="https://www.youtube.com/@zanbo03" target="_blank" rel="noopener noreferrer" class="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 16 16" class="mr-2.5 w-5 h-5">
                  <g fill-rule="evenodd" clip-rule="evenodd">
                    <path fill="#F44336" d="M15.32 4.06c-.434-.772-.905-.914-1.864-.968C12.498 3.027 10.089 3 8.002 3c-2.091 0-4.501.027-5.458.091-.957.055-1.429.196-1.867.969C.23 4.831 0 6.159 0 8.497v.008c0 2.328.23 3.666.677 4.429.438.772.909.912 1.866.977.958.056 3.368.089 5.459.089 2.087 0 4.496-.033 5.455-.088.959-.065 1.43-.205 1.864-.977.451-.763.679-2.101.679-4.429v-.008c0-2.339-.228-3.667-.68-4.438z"></path>
                    <path fill="#FAFAFA" d="M6 11.5v-6l5 3z"></path>
                  </g>
                </svg>
                <span class="group-hover:underline">YouTube: @zanbo03</span>
              </a>
            </li>
            <li>
              <a href="https://web.facebook.com/hphuoc171" target="_blank" rel="noopener noreferrer" class="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
                  alt="Facebook Icon"
                  class="mr-2.5 w-5 h-5"
                />
                <span class="group-hover:underline">Facebook: Trần Hữu Phước</span>
              </a>
            </li>
            <li>
              <div class="flex items-center text-gray-700 dark:text-slate-300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/120px-Icon_of_Zalo.svg.png"
                  alt="Zalo Icon"
                  class="mr-2.5 w-5 h-5"
                />
                <span>Zalo: 0826263689</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="space-y-3 pt-3 border-t dark:border-slate-700">
          <h4 class="text-md font-semibold text-gray-700 dark:text-slate-300 border-b dark:border-slate-700 pb-1 mb-2">
            <font-awesome-icon icon="hand-holding-usd" class="mr-2 text-green-500" />Ủng hộ tôi
          </h4>
          <div class="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md text-sm space-y-2">
            <p class="text-gray-800 dark:text-slate-200 flex items-center">
              <font-awesome-icon icon="landmark" class="mr-1.5 h-4 w-4 text-green-600 dark:text-green-400" />
              Ngân hàng: <span class="font-medium ml-1">Vietcombank</span>
            </p>
            <p class="text-gray-800 dark:text-slate-200 flex items-center">
              <font-awesome-icon icon="user" class="mr-1.5 h-4 w-4 text-sky-600 dark:text-sky-400" />
              Người thụ hưởng: <span class="font-medium ml-1">TRAN HUU PHUOC</span>
            </p>
            <div class="flex items-center justify-between">
              <p class="text-gray-800 dark:text-slate-200 flex items-center">
                <font-awesome-icon icon="credit-card" class="mr-1.5 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                STK: <span class="font-mono font-semibold text-blue-600 dark:text-blue-400 ml-1">1027810630</span>
              </p>
              <button @click="copyToClipboard('1027810630')" title="Sao chép số tài khoản" class="text-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2.5 rounded-md transition-colors flex items-center">
                <font-awesome-icon icon="copy" class="mr-1" />Sao chép
              </button>
            </div>

            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 text-center">
              <p class="text-gray-700 dark:text-slate-300 mb-2">
                hoặc bạn có thể quét qua mã QR:
              </p>
              <img
                src="https://img.vietqr.io/image/VCB-1027810630-compact.png"
                alt="Mã QR Vietcombank Trần Hữu Phước"
                class="w-40 h-auto mx-auto rounded-lg border border-gray-300 dark:border-slate-600 shadow-sm"
              />
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-slate-400 text-center">
            Sự ủng hộ của bạn là động lực lớn để tôi tiếp tục phát triển các dự án hữu ích!
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useNotifications } from '@/composables/useNotifications';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);
const { showToast } = useNotifications();

watch(() => props.isOpen, (newVal) => {
});

const copyToClipboard = async (textToCopy) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast('Đã sao chép vào clipboard!', 'success');
  } catch (err) {
    console.error('Failed to copy: ', err);
    showToast('Không thể sao chép.', 'error');
  }
};

const closeModal = () => {
  emit('close');
};

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>