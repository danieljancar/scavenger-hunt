import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

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

  async presentError(message: string) {
    await this.presentToast(message, 3000, 'danger');
  }

  async presentSuccess(message: string) {
    await this.presentToast(message, 2000, 'success');
  }
}
