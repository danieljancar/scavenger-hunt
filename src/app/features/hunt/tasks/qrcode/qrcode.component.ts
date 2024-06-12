import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { HuntMeta } from '../../../../types/hunt.types';
import { HuntService } from '../../../../core/data/hunt.service';
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerCameraDirection,
  CapacitorBarcodeScannerScanOrientation,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';
import { Haptics } from '@capacitor/haptics';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar,
  ],
  providers: [CapacitorBarcodeScanner],
})
export class QrcodeComponent implements OnInit {
  @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>();
  protected huntMeta!: HuntMeta;
  protected taskDone = false;
  private taskStartTime!: Date;

  constructor(
    private huntService: HuntService,
    private huntCommunicationService: HuntCommunicationService,
    private toastController: ToastController,
  ) {
    addIcons({ cameraOutline });
  }

  async ngOnInit() {
    this.huntMeta = await this.huntService.getCurrentHuntMeta();
    this.taskStartTime = new Date();
  }

  async startScan() {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
        scanInstructions: 'Please scan the QR code',
        scanButton: false,
        scanText: 'Scan',
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
        scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
        web: {
          showCameraSelection: true,
          scannerFPS: 30,
        },
      });

      if (result.ScanResult === 'M335@ICT-BZ') {
        await Haptics.vibrate({ duration: 1500 }).then(() => {
          this.taskDone = true;
        });
      } else {
        await this.toastController
          .create({
            message: 'Wrong QR code scanned, try again!',
            duration: 2000,
            color: 'warning',
            position: 'top',
          })
          .then((t) => t.present());
      }
    } catch (error) {
      console.error('Error scanning QR code', error);
      await this.toastController
        .create({
          message: 'Error scanning QR code, try again.',
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((t) => t.present());
    }
  }

  onCancelHunt() {
    this.resetHunt.emit();
    this.huntService.currentTaskIndex = 0;
    this.huntCommunicationService.cancelHunt();
  }

  async continueTask() {
    await this.completeTask();
  }

  private async completeTask() {
    this.taskDone = true;
    await this.huntService.completeCurrentTask(this.taskStartTime);
  }
}
