import { create } from 'zustand';

export interface ErrorInfo {
  title: string;
  message: string;
  statusCode?: number;
}

interface ErrorState {
  isOpen: boolean;
  error: ErrorInfo | null;
  showError: (error: ErrorInfo) => void;
  hideError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isOpen: false,
  error: null,
  showError: (error: ErrorInfo) =>
    set({
      isOpen: true,
      error,
    }),
  hideError: () =>
    set({
      isOpen: false,
      error: null,
    }),
}));


