import { ref } from 'vue';

export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'primary' | 'warning';
}

export interface SuccessOptions {
  title?: string;
  description?: string;
  buttonText?: string;
}

// Singleton state for global programmatic modals
const isConfirmOpen = ref(false);
const isConfirmLoading = ref(false);
const confirmConfig = ref<ConfirmOptions>({});
let confirmResolve: ((value: boolean) => void) | null = null;

const isSuccessOpen = ref(false);
const successConfig = ref<SuccessOptions>({});
let successResolve: (() => void) | null = null;

export function useModal() {
  /**
   * Programmatically opens a confirmation modal and returns a Promise<boolean>
   */
  function confirm(options: ConfirmOptions): Promise<boolean> {
    confirmConfig.value = {
      title: options.title || 'Are you sure?',
      description: options.description || 'This action cannot be undone.',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      variant: options.variant || 'destructive',
    };
    isConfirmLoading.value = false;
    isConfirmOpen.value = true;

    return new Promise<boolean>((resolve) => {
      confirmResolve = resolve;
    });
  }

  function handleConfirmAction() {
    if (confirmResolve) {
      confirmResolve(true);
      confirmResolve = null;
    }
    isConfirmOpen.value = false;
  }

  function handleCancelAction() {
    if (confirmResolve) {
      confirmResolve(false);
      confirmResolve = null;
    }
    isConfirmOpen.value = false;
  }

  /**
   * Programmatically opens a success modal and returns a Promise<void> when dismissed
   */
  function success(options: SuccessOptions = {}): Promise<void> {
    successConfig.value = {
      title: options.title || 'Congratulations !',
      description: options.description || 'The operation has been completed successfully.',
      buttonText: options.buttonText || 'Continue',
    };
    isSuccessOpen.value = true;

    return new Promise<void>((resolve) => {
      successResolve = resolve;
    });
  }

  function handleSuccessDismiss() {
    if (successResolve) {
      successResolve();
      successResolve = null;
    }
    isSuccessOpen.value = false;
  }

  return {
    // Methods
    confirm,
    success,

    // Internal state for ModalHost
    _state: {
      isConfirmOpen,
      isConfirmLoading,
      confirmConfig,
      isSuccessOpen,
      successConfig,
      handleConfirmAction,
      handleCancelAction,
      handleSuccessDismiss,
    },
  };
}
