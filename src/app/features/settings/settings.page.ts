import { Component } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DeviceService } from '../../core/native/device.service';
import { DeviceInfo } from '../../types/device.types';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { StorageService } from '../../core/native/storage.service';
import { FormatBytesPipe } from '../../pipes/format-bytes.pipe';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    LoadingComponent,
    IonLabel,
    IonItem,
    IonList,
    IonNote,
    IonProgressBar,
    IonButton,
    IonSpinner,
    FormatBytesPipe,
    IonRefresherContent,
    IonRefresher,
  ],
})
export class SettingsPage {
  protected deviceInfo: DeviceInfo | null = null;
  protected storageUsage: number | null = null;
  protected isLoading = false;
  protected clearStorageButtonLoading = false;

  constructor(
    private deviceService: DeviceService,
    private storageService: StorageService,
  ) {}

  async ionViewWillEnter() {
    await this.loadDeviceInfo();
  }

  async loadDeviceInfo() {
    this.isLoading = true;
    this.storageUsage = Number(await this.storageService.getStorageUsage());
    await this.deviceService
      .getDeviceInfo()
      .then((deviceInfo) => {
        this.deviceInfo = deviceInfo;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  async clearStorage() {
    this.clearStorageButtonLoading = true;
    await this.storageService
      .clearStorage()
      .then(async () => {
        this.storageUsage = Number(await this.storageService.getStorageUsage());
      })
      .finally(() => {
        this.clearStorageButtonLoading = false;
      });
  }
}
