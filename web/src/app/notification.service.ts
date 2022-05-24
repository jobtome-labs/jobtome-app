import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  private _openSnackBar(message: string, action: string, configuration: MatSnackBarConfig) {
    this._snackBar.open(message, action, configuration);
  }

  showInformation(message: string) {
    this._openSnackBar(
      message,
      "Close",
      {
        duration: 5 * 1000,
        panelClass: ["normal-snackbar"]
      });
  }

  showSuccess(message: string) {
    this._openSnackBar(
      message,
      "Close",
      {
        duration: 5 * 1000,
        panelClass: ["green-snackbar"]
      });
  }

  showError(message: string) {
    this._openSnackBar(
      message,
      "Close",
      {
        duration: 5 * 1000,
        panelClass: ["red-snackbar"]
      });
  }

}
