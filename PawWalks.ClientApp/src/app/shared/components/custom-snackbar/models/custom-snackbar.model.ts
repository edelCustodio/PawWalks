export interface CustomSnackbarData {
  message: string;
  type: SnackbarType;
}

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';
