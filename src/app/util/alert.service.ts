import { Injectable } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
  ) {}

  /**
   * Presents an alert with the given header, message, and buttons.
   *
   * @example
   * this.alertService.presentAlert('Alert Header', 'Alert Message', ['OK']);
   *
   * @param {string} header - The header of the alert.
   * @param {string} message - The message of the alert.
   * @param {any[]} buttons - The buttons of the alert.
   */
  public async presentAlert(header: string, message: string, buttons: any[]) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons,
    });

    await alert.present();
  }

  /**
   * Presents an action sheet with the given header and buttons.
   *
   * @example
   * this.alertService.presentActionSheet('Action Sheet Header', [
   *   {
   *     text: 'Delete',
   *     role: 'destructive',
   *     handler: () => {
   *       console.log('Delete clicked');
   *     }
   *   }, {
   *     text: 'Cancel',
   *     role: 'cancel',
   *     handler: () => {
   *       console.log('Cancel clicked');
   *     }
   *   }
   * ]);
   *
   * @param {string} header - The header of the action sheet.
   * @param {any[]} buttons - The buttons of the action sheet.
   */
  public async presentActionSheet(header: string, buttons: any[]) {
    const actionSheet = await this.actionSheetController.create({
      header: header,
      buttons: buttons,
    });

    await actionSheet.present();
  }
}
