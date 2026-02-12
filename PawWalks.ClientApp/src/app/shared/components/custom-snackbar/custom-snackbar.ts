import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import {
  CustomSnackbarData,
  SnackbarType,
} from './models/custom-snackbar.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-custom-snackbar',
  imports: [NgClass],
  templateUrl: './custom-snackbar.html',
  styleUrl: './custom-snackbar.scss',
})
export class CustomSnackbar {
  data: CustomSnackbarData = inject(MAT_SNACK_BAR_DATA);

  getIcon(type: SnackbarType): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }
}
