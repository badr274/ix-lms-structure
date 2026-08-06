import { toast } from 'vue-sonner';

/**
 * 🔔 Universal Toast Composable wrapping off-the-shelf vue-sonner library
 */
export function useAppToast() {
  return {
    success: (message: string, title?: string) => {
      if (title) {
        toast.success(title, { description: message });
      } else {
        toast.success(message);
      }
    },
    error: (message: string, title?: string) => {
      if (title) {
        toast.error(title, { description: message });
      } else {
        toast.error(message);
      }
    },
    warning: (message: string, title?: string) => {
      if (title) {
        toast.warning(title, { description: message });
      } else {
        toast.warning(message);
      }
    },
    info: (message: string, title?: string) => {
      if (title) {
        toast.info(title, { description: message });
      } else {
        toast.info(message);
      }
    },
    dismiss: (id?: string | number) => toast.dismiss(id),
    raw: toast,
  };
}
