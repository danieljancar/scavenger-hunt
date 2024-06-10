import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  /**
   * Presents a toast with the given message, duration, and color.
   *
   * @example
   * this.toastService.presentToast('Toast Message', 2000, 'dark');
   *
   * @param {string} message - The message of the toast.
   * @param {number} duration - The duration of the toast in milliseconds.
   * @param {string} color - The color of the toast.
   */
  async presentToast(
    message: string,
    duration: number = 2000,
    color: string = 'dark',
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  /**
   * Presents an error toast with the given message.
   *
   * @example
   * this.toastService.presentError('Error Message');
   *
   * @param {string} message - The message of the error toast.
   */
  async presentError(message: string) {
    await this.presentToast(message, 3000, 'danger');
  }

  /**
   * Presents a success toast with the given message.
   *
   * @example
   * this.toastService.presentSuccess('Success Message');
   *
   * @param {string} message - The message of the success toast.
   */
  async presentSuccess(message: string) {
    await this.presentToast(message, 2000, 'success');
  }
}
