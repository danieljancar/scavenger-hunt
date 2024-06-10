import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonProgressBar,
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
  ],
})
export class SettingsPage implements OnInit {
  protected deviceInfo: DeviceInfo | null = null;
  protected storageUsage: number | null = null;
  protected isLoading = false;
  protected clearStorageButtonLoading = false;

  constructor(
    private deviceService: DeviceService,
    private storageService: StorageService,
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    await this.deviceService
      .getDeviceInfo()
      .then((deviceInfo) => {
        this.deviceInfo = deviceInfo;
      })
      .then(async () => {
        this.storageUsage = Number(await this.storageService.getStorageUsage());
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
