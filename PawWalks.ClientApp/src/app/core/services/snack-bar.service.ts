import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbar } from '../../shared/components/custom-snackbar/custom-snackbar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  success(message: string) {
    return this._snackBar.openFromComponent(CustomSnackbar, {
      data: { message, type: 'success' },
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }

  warning(message: string) {
    return this._snackBar.openFromComponent(CustomSnackbar, {
      data: { message, type: 'warning' },
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-warning'],
    });
  }

  error(message: string) {
    return this._snackBar.openFromComponent(CustomSnackbar, {
      data: { message, type: 'error' },
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }

  info(message: string) {
    return this._snackBar.openFromComponent(CustomSnackbar, {
      data: { message, type: 'info' },
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-info'],
    });
  }
}
