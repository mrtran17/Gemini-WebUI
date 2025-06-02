<template>
  <div class="w-64 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 p-4 flex flex-col shrink-0">
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-gray-900 dark:text-slate-100">Lịch sử trò chuyện</h2>
    </div>
    <div
      class="flex-1 overflow-y-auto space-y-1.5 no-scrollbar pr-1 -mr-1 custom-scrollbar"
    >
      <div
        v-for="convo in conversations"
        :key="convo.id"
        @click="handleClickConversation(convo.id)"
        class="p-2.5 rounded-lg cursor-pointer text-sm flex justify-between items-center group transition-colors border border-gray-200 dark:border-slate-700"
        :class="getItemClasses(convo.id)"
      >
        <template v-if="editingConvoId === convo.id">
          <input
            :ref="el => { if (el && editingConvoId === convo.id) editInputRef = el; }"
            v-model.trim="editInputValue"
            @blur="saveEdit(convo.id)"
            @keydown.enter.prevent="saveEdit(convo.id)"
            @keydown.esc.prevent="cancelEdit"
            class="flex-1 outline-none border rounded-md px-1 py-0.5 border-blue-500 dark:border-blue-400 mr-2 text-sm"
            :style="{ backgroundColor: isDarkMode ? '#334155' : '#ffffff', color: isDarkMode ? '#f1f5f9' : '#1f2937' }"
            @click.stop
          />
        </template>
        <template v-else>
          <span
            class="truncate pr-2"
            @dblclick.stop="startEditing(convo)"
          >{{ convo.title || 'Trò chuyện không tên' }}</span>
        </template>
        <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            @click.stop="startEditing(convo)"
            class="edit-convo-btn flex-shrink-0 p-1 hover:text-blue-600 dark:hover:text-blue-300"
            title="Sửa tên cuộc trò chuyện"
            v-if="editingConvoId !== convo.id"
          >
            <font-awesome-icon icon="pencil-alt" class="text-gray-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
          </button>
          <button
            @click.stop="askToDelete(convo.id)"
            class="delete-convo-btn flex-shrink-0 p-1 ml-1 hover:text-red-600 dark:hover:text-red-300"
            title="Xoá cuộc trò chuyện"
          >
            <font-awesome-icon icon="trash-alt" class="text-gray-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400" />
          </button>
        </div>
      </div>
       <div v-if="!conversations || conversations.length === 0" class="text-center text-xs text-gray-500 dark:text-slate-400 py-4">
        Chưa có cuộc trò chuyện nào.
      </div>
    </div>
    <div class="text-xs text-gray-500 dark:text-slate-400 text-center mt-2 px-1 pt-2 border-t border-gray-200 dark:border-slate-700">
      Thiết kế bởi <span class="text-sky-500 font-bold">Phước Trần</span>
    </div>

    <!-- Reused Confirmation Modal -->
    <ConfirmationModal
      :isOpen="showDeleteModal"
      message="Bạn có chắc chắn muốn xoá cuộc trò chuyện này không?"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { useTheme } from '@/composables/useTheme';
import ConfirmationModal from './ConfirmationModal.vue'; // Import the ConfirmationModal component

const props = defineProps({
  conversations: Array,
  currentConversationId: String,
});

const emit = defineEmits(['switchConversation', 'deleteConversation', 'updateConversationTitle']);

const { isDarkMode } = useTheme();

const editingConvoId = ref(null);
const editInputValue = ref('');
const editInputRef = ref(null);

const showDeleteModal = ref(false);
const convoToDeleteId = ref(null);

watch(() => props.currentConversationId, (newId, oldId) => {
  if (newId !== oldId && editingConvoId.value && editingConvoId.value !== newId) {
    cancelEdit();
  }
});

const getItemClasses = (convoId) => {
  const isActive = props.currentConversationId === convoId;
  if (isActive) {
    return isDarkMode.value
      ? 'bg-blue-600 font-semibold text-white border-blue-600 shadow-sm'
      : 'bg-blue-500 text-white font-semibold border-blue-500 shadow-sm';
  }
  return isDarkMode.value
    ? 'bg-transparent text-slate-100 hover:text-white hover:bg-slate-700 border-slate-700'
    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-200';
};

const handleClickConversation = (convoId) => {
  if (editingConvoId.value && editingConvoId.value !== convoId) {
    saveEdit(editingConvoId.value);
  }
  editingConvoId.value = null;
  emit('switchConversation', convoId);
};

const startEditing = (convo) => {
  if (editingConvoId.value && editingConvoId.value !== convo.id) {
    saveEdit(editingConvoId.value);
  }
  editingConvoId.value = convo.id;
  editInputValue.value = convo.title || '';
  nextTick(() => {
    if (editInputRef.value) {
      editInputRef.value.focus();
      editInputRef.value.select();
    }
  });
};

const saveEdit = (convoId) => {
  if (editingConvoId.value !== convoId) return;

  const newTitle = editInputValue.value.trim();
  const originalConvo = props.conversations.find(c => c.id === convoId);
  const originalTitle = originalConvo ? (originalConvo.title || '') : '';

  if (newTitle && newTitle !== originalTitle) {
    console.log('Sidebar: Emitting updateConversationTitle:', { id: convoId, title: newTitle });
    emit('updateConversationTitle', { id: convoId, title: newTitle });
  } else if (!newTitle && originalTitle) {
     editInputValue.value = originalTitle;
  }

  editingConvoId.value = null;
};

const cancelEdit = () => {
  editingConvoId.value = null;
  editInputValue.value = '';
};

const askToDelete = (convoId) => {
  convoToDeleteId.value = convoId;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  emit('deleteConversation', convoToDeleteId.value);
  showDeleteModal.value = false;
  convoToDeleteId.value = null;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  convoToDeleteId.value = null;
};

</script> 