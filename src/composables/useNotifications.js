// src/composables/useNotifications.js
import { reactive, ref, readonly } from 'vue';

// --- State defined outside the function, making it a module-level singleton ---
// This `toastState` object will be shared across all components that use this composable.
const toastState = reactive({
  visible: false,
  message: '',
  type: 'success', // Default type
  id: null,        // Unique ID for the toast instance, useful for debugging or if you ever want to manage multiple toasts
});

// `timeoutId` stores the ID of the setTimeout, so it can be cleared if a new toast is shown
// or if the toast is dismissed manually.
const timeoutId = ref(null);

// --- The composable function ---
// When `useNotifications()` is called, it returns methods to interact with the shared `toastState`.
export function useNotifications() {

  /**
   * Displays a toast notification.
   * @param {string} message - The message to display in the toast.
   * @param {string} [type='success'] - The type of toast (e.g., 'success', 'error', 'warn', 'info').
   * @param {number} [duration=3000] - The duration in milliseconds for which the toast will be visible.
   */
  const showToast = (message, type = 'success', duration = 3000) => {
    // If a toast is already scheduled to hide (i.e., a timeout is active),
    // clear that timeout. This ensures that if `showToast` is called multiple times
    // in quick succession, only the latest toast's timer will be active.
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
      timeoutId.value = null; // Clear the stored ID
    }

    // Update the shared toast state with the new toast's properties.
    toastState.message = message;
    toastState.type = type;
    toastState.id = Date.now(); // Assign a unique ID (timestamp) to this toast instance.
    toastState.visible = true;  // Make the toast visible.

    // Set a new timeout to automatically hide this toast after the specified duration.
    timeoutId.value = setTimeout(() => {
      // When the timeout elapses, call the internal function to hide the toast.
      // It's good practice to check if this specific toast (by ID) is still the one
      // that should be hidden, although with the immediate clearing of previous timeouts,
      // this specific check might be less critical but adds robustness.
      // For simplicity in this common use case (one toast at a time), directly hiding is often fine.
      hideToastInternal();
    }, duration);
  };

  /**
   * Internal function to hide the toast and clear any active timeout.
   * This is not typically exposed directly but used by `showToast` (on timeout)
   * and the public `hideToast`.
   */
  const hideToastInternal = () => {
    toastState.visible = false; // Set visibility to false.
    // If there was an active timeout (e.g., the toast was dismissed manually before timeout),
    // clear it to prevent it from trying to hide an already hidden toast.
    if (timeoutId.value) {
        clearTimeout(timeoutId.value);
        timeoutId.value = null; // Clear the stored timeout ID.
    }
  };

  /**
   * Public function to manually dismiss/hide the currently visible toast.
   * This can be called by a dismiss button on the Toast component, for example.
   */
  const hideToast = () => {
      hideToastInternal(); // Use the internal logic to hide.
  };

  // Return the reactive state (as readonly to prevent direct modification from outside)
  // and the methods to control the toast.
  return {
    /**
     * The reactive state of the toast.
     * It's wrapped in `readonly` to encourage state updates only through `showToast` and `hideToast`.
     * @type {Readonly<typeof toastState>}
     */
    toast: readonly(toastState),
    showToast,
    hideToast,
  };
}