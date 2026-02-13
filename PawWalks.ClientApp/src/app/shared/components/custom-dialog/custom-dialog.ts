import { NgClass } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomDialogConfig } from './models/custom-dialog.model';

@Component({
  selector: 'app-custom-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, NgClass],
  templateUrl: './custom-dialog.html',
  styleUrl: './custom-dialog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CustomDialog {
  data: CustomDialogConfig = inject(MAT_DIALOG_DATA);
}
