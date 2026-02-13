import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomDialogConfig } from '../../shared/components/custom-dialog/models/custom-dialog.model';
import { CustomDialog } from '../../shared/components/custom-dialog/custom-dialog';
import { merge } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private _matDialog: MatDialog = inject(MatDialog);
  private _defaultConfig: CustomDialogConfig = {
    title: 'Confirm action',
    message: 'Are you sure you want to confirm this action?',
    icon: {
      show: true,
      name: 'heroicons_outline:exclamation-triangle',
      color: 'warn',
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirm',
        color: 'warn',
      },
      cancel: {
        show: true,
        label: 'Cancel',
      },
    },
    dismissible: false,
  };

  open(config: CustomDialogConfig = {}): MatDialogRef<CustomDialog> {
    // Merge the user config with the default config
    const userConfig = merge({}, this._defaultConfig, config);

    // Open the dialog
    return this._matDialog.open(CustomDialog, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: 'custom-dialog-panel',
    });
  }
}
