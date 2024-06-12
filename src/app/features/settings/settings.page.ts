import { Component, OnInit } from '@angular/core';
import {
  AlertController,
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
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { DeviceService } from '../../core/native/device.service';
import { DeviceInfo } from '../../types/device.types';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { StorageService } from '../../core/native/storage.service';
import { FormatBytesPipe } from '../../pipes/format-bytes.pipe';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';

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
    IonToggle,
    FormsModule,
  ],
})
export class SettingsPage implements OnInit {
  protected deviceInfo: DeviceInfo | null = null;
  protected storageUsage: number | null = null;
  protected isLoading = false;
  protected clearStorageButtonLoading = false;
  protected geolocationPermission = false;
  protected cameraPermission = false;

  constructor(
    private deviceService: DeviceService,
    private storageService: StorageService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  async ngOnInit() {
    await this.loadDeviceInfo();
    await this.checkPermissions();
  }

  async ionViewWillEnter() {
    await this.loadStorageUsage();
  }

  async loadStorageUsage() {
    this.storageUsage = Number(await this.storageService.getStorageUsage());
  }

  async loadDeviceInfo() {
    this.isLoading = true;
    await this.deviceService
      .getDeviceInfo()
      .then((deviceInfo) => {
        this.deviceInfo = deviceInfo;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  async checkPermissions() {
    const geolocationStatus = await Geolocation.checkPermissions();
    const cameraStatus = await Camera.checkPermissions();

    this.geolocationPermission = geolocationStatus.location === 'granted';
    this.cameraPermission = cameraStatus.camera === 'granted';
  }

  async toggleGeolocationPermission() {
    if (!this.geolocationPermission) {
      await Geolocation.requestPermissions();
    }
  }

  async toggleCameraPermission() {
    if (!this.cameraPermission) {
      await Camera.requestPermissions();
    }
  }

  async clearStorage() {
    await this.alertController
      .create({
        header: 'Clear Storage',
        message: 'Are you sure you want to clear all data?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Clear',
            handler: () => {
              this.clearStorageAction();
            },
          },
        ],
      })
      .then((a) => a.present());
  }

  private async clearStorageAction() {
    this.clearStorageButtonLoading = true;
    await this.storageService
      .clearStorage()
      .then(async () => {
        await this.loadStorageUsage();
      })
      .finally(() => {
        this.clearStorageButtonLoading = false;
      });
    await this.toastController
      .create({
        message: 'Storage cleared',
        duration: 2000,
        color: 'success',
        position: 'top',
      })
      .then((t) => t.present());
  }
}
