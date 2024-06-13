import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core'
import {
    AlertController,
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
} from '@ionic/angular/standalone'
import { HuntMeta } from '../../../../types/hunt.types'
import { HuntService } from '../../../../core/data/hunt.service'
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service'
import { addIcons } from 'ionicons'
import { cameraOutline } from 'ionicons/icons'
import {
    CapacitorBarcodeScanner,
    CapacitorBarcodeScannerCameraDirection,
    CapacitorBarcodeScannerScanOrientation,
    CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner'
import { Haptics } from '@capacitor/haptics'
import { Camera } from '@capacitor/camera'

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
    @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>()
    protected huntMeta!: HuntMeta
    protected taskDone = false
    private taskStartTime!: Date

    constructor(
        private huntService: HuntService,
        private huntCommunicationService: HuntCommunicationService,
        private toastController: ToastController,
        private alertController: AlertController,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        addIcons({ cameraOutline })
    }

    async ngOnInit() {
        this.huntMeta = await this.huntService.getCurrentHuntMeta()
        this.taskStartTime = new Date()
    }

    async startScan() {
        const status = await Camera.checkPermissions()
        if (status) {
            try {
                const result = await CapacitorBarcodeScanner.scanBarcode({
                    hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
                    scanInstructions: 'Please scan the QR code',
                    scanButton: false,
                    scanText: 'Scan',
                    cameraDirection:
                        CapacitorBarcodeScannerCameraDirection.BACK,
                    scanOrientation:
                        CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
                    web: {
                        showCameraSelection: true,
                        scannerFPS: 30,
                    },
                })

                if (result.ScanResult === 'M335@ICT-BZ') {
                    await Haptics.vibrate()
                    this.taskDone = true
                    this.changeDetectorRef.detectChanges()
                } else {
                    await this.showToast(
                        'Wrong QR code scanned, try again!',
                        'warning'
                    )
                }
            } catch (error) {
                console.error('Error scanning QR code', error)
                await this.showToast(
                    'Error scanning QR code, try again.',
                    'danger'
                )
            }
        } else {
            await this.presentPermissionDeniedAlert()
        }
    }

    async presentPermissionDeniedAlert() {
        const alert = await this.alertController.create({
            header: 'Camera Permission Required',
            message:
                'Please allow access to your camera in your settings to scan the QR code.',
            buttons: [
                {
                    text: 'Dismiss',
                    role: 'cancel',
                    handler: () => {
                        this.onCancelHunt()
                    },
                },
            ],
        })
        await alert.present()
    }

    async showToast(message: string, color: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color,
            position: 'top',
        })
        await toast.present()
    }

    onCancelHunt() {
        this.resetHunt.emit()
        this.huntService.currentTaskIndex = 0
        this.huntCommunicationService.cancelHunt()
    }

    async continueTask() {
        if (this.taskDone) {
            await this.completeTask()
        } else {
            await this.showToast(
                'Task not completed yet. Scan the correct QR code.',
                'warning'
            )
        }
    }

    private async completeTask() {
        await this.huntService.completeCurrentTask(this.taskStartTime)
        this.resetHunt.emit()
    }
}
