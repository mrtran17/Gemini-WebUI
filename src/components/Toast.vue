<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="transform translate-x-full opacity-0 scale-95"
      enter-to-class="transform translate-x-0 opacity-100 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="transform translate-x-0 opacity-100 scale-100"
      leave-to-class="transform translate-x-full opacity-0 scale-95"
    >
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-[9999] max-w-xs w-full sm:w-80"
        role="alert"
        aria-live="polite"
      >
        <div
          class="relative overflow-hidden rounded-xl shadow-lg backdrop-blur-sm border border-white/20"
          :class="toastStyles.container"
        >
          <!-- Subtle glow effect -->
          <div 
            class="absolute inset-0 opacity-10 blur-lg"
            :class="toastStyles.glow"
          ></div>

          <!-- Main content -->
          <div class="relative flex items-center gap-3 p-3">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <font-awesome-icon
                :icon="toastStyles.icon"
                class="text-lg"
                :class="toastStyles.iconColor"
              />
            </div>

            <!-- Message content -->
            <div class="flex-1 min-w-0">
              <p 
                class="text-sm font-medium"
                :class="toastStyles.textColor"
                v-html="message"
              ></p>
            </div>

            <!-- Close button -->
            <button
              @click="dismissToast"
              class="flex-shrink-0 p-1 rounded-lg transition-all duration-200 hover:scale-110"
              :class="toastStyles.closeButton"
              aria-label="Đóng"
            >
              <font-awesome-icon
                icon="times"
                class="text-xs"
              />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  visible: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 5000 // 5 seconds
  },
  autoClose: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['dismiss']);

const progressWidth = ref(100);
let progressTimer = null;

const toastStyles = computed(() => {
  const styles = {
    success: {
      container: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
      icon: 'check-circle',
      iconColor: 'text-white',
      textColor: 'text-white',
      closeButton: 'text-white/80 hover:text-white hover:bg-white/20',
      glow: 'bg-emerald-400'
    },
    error: {
      container: 'bg-gradient-to-r from-red-500 to-rose-500 text-white',
      icon: 'times-circle',
      iconColor: 'text-white',
      textColor: 'text-white',
      closeButton: 'text-white/80 hover:text-white hover:bg-white/20',
      glow: 'bg-red-400'
    },
    warning: {
      container: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
      icon: 'exclamation-triangle',
      iconColor: 'text-white',
      textColor: 'text-white',
      closeButton: 'text-white/80 hover:text-white hover:bg-white/20',
      glow: 'bg-amber-400'
    },
    info: {
      container: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
      icon: 'info-circle',
      iconColor: 'text-white',
      textColor: 'text-white',
      closeButton: 'text-white/80 hover:text-white hover:bg-white/20',
      glow: 'bg-blue-400'
    }
  };

  return styles[props.type] || styles.success;
});

const startProgress = () => {
  if (!props.autoClose || props.duration <= 0) return;
  
  progressWidth.value = 100;
  
  // Use requestAnimationFrame for smooth animation
  const startTime = Date.now();
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, props.duration - elapsed);
    progressWidth.value = (remaining / props.duration) * 100;
    
    if (remaining > 0) {
      progressTimer = requestAnimationFrame(animate);
    } else {
      dismissToast();
    }
  };
  
  progressTimer = requestAnimationFrame(animate);
};

const stopProgress = () => {
  if (progressTimer) {
    cancelAnimationFrame(progressTimer);
    progressTimer = null;
  }
};

const dismissToast = () => {
  stopProgress();
  emit('dismiss');
};

// Watch for visibility changes
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    startProgress();
  } else {
    stopProgress();
  }
});

// Cleanup on unmount
onMounted(() => {
  if (props.visible) {
    startProgress();
  }
});
</script>

<style scoped>
/* Custom animations */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Enhance backdrop blur support */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(12px);
  }
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>