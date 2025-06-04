<template>
  <div class="relative inline-block text-left" ref="modelSelectorRef">
    <div>
      <button
        type="button"
        class="inline-flex justify-between items-center w-full rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-700 focus:ring-blue-500"
        id="options-menu"
        aria-haspopup="true"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        {{ selectedModelDisplayName }}
        <font-awesome-icon icon="chevron-down" class="-mr-1 ml-2 h-4 w-4" />
      </button>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div class="py-1" role="none">
          <button
            v-for="model in availableModels"
            :key="model.value"
            @click="selectModel(model.value)"
            class="block w-full text-left px-4 py-2 text-sm"
            :class="[
              model.value === currentModel
                ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-slate-100'
                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600',
            ]"
            role="menuitem"
          >
            {{ model.text }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  currentModel: String,
  availableModels: Array,
  getModelDisplayNameExt: Function, // Assuming this prop is available from parent
});

const emit = defineEmits(['update:currentModel']);

const isOpen = ref(false);
const modelSelectorRef = ref(null); // Ref for the root element

const selectedModelDisplayName = computed(() => {
    // Display the name of the currentModel if it exists
    if (props.currentModel && props.getModelDisplayNameExt) {
        return props.getModelDisplayNameExt(props.currentModel);
    }
    // If no current model, and available models exist, maybe show a generic or first model text? Let's stick to "Select Model" if none is selected.
    // Fallback to the first available model's name is not needed for display text here.

    return "Chọn mô hình AI"; // Default text if no model is selected
});

const selectModel = (modelValue) => {
  emit('update:currentModel', modelValue);
  isOpen.value = false;
};

// Add a watcher to debug the currentModel prop
watch(() => props.currentModel, (newValue, oldValue) => {
    console.log('ModelSelector: currentModel prop changed from', oldValue, 'to', newValue);
});

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (modelSelectorRef.value && !modelSelectorRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* No specific scoped styles needed, relying on Tailwind */
</style>