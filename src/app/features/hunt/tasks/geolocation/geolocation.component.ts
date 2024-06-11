import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HuntMeta } from '../../../../types/hunt.types';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HuntService } from '../../../../core/data/hunt.service';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonFooter,
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonButtons,
  ],
})
export class GeolocationComponent implements OnInit {
  @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>();
  protected huntMeta!: HuntMeta;
  protected taskDone = false;
  private taskStartTime!: Date;
  private targetLatitude = 47.173995;
  private targetLongitude = 8.093872;
  private proximityThreshold = 50; // In meters

  constructor(
    private huntService: HuntService,
    private huntCommunicationService: HuntCommunicationService,
    private alertController: AlertController,
  ) {
    addIcons({ locationOutline });
  }

  async ngOnInit() {
    this.huntMeta = await this.huntService.getCurrentHuntMeta();
    this.taskStartTime = new Date();
    await this.checkLocationPermission();
  }

  async checkLocationPermission() {
    const permissionStatus = await Geolocation.checkPermissions();
    if (permissionStatus.location === 'granted') {
      await this.getCurrentLocation();
    } else {
      await this.requestLocationPermission();
    }
  }

  async requestLocationPermission() {
    const permissionStatus = await Geolocation.requestPermissions();
    if (permissionStatus.location === 'granted') {
      await this.getCurrentLocation();
    } else {
      await this.presentPermissionDeniedAlert();
    }
  }

  async getCurrentLocation() {
    const position = await Geolocation.getCurrentPosition();
    await this.checkProximity(position);
  }

  async checkProximity(position: Position) {
    const distance = this.calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      this.targetLatitude,
      this.targetLongitude,
    );
    if (distance <= this.proximityThreshold) {
      await Haptics.vibrate();
      this.taskDone = true;
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    // Formula based on: https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  async presentPermissionDeniedAlert() {
    const alert = await this.alertController.create({
      header: 'Location Permission Required',
      message:
        'Please grant permission to access your device location to proceed with the hunt.',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {
            this.onCancelHunt();
          },
        },
      ],
    });
    await alert.present();
  }

  async onCancelHunt() {
    this.resetHunt.emit();
    this.huntService.currentTaskIndex = 0;
    this.huntCommunicationService.cancelHunt();
  }

  async continueTask() {
    if (this.taskDone) {
      await this.completeTask();
    }
  }

  private async completeTask() {
    await this.huntService.completeCurrentTask(this.taskStartTime);
    this.resetHunt.emit();
  }
}
