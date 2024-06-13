import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
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
} from '@ionic/angular/standalone'
import { HuntMeta } from '../../../../types/hunt.types'
import { HuntService } from '../../../../core/data/hunt.service'
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service'
import { addIcons } from 'ionicons'
import { batteryHalfOutline } from 'ionicons/icons'
import { Device } from '@capacitor/device'
import { Haptics } from '@capacitor/haptics'
import { Router } from '@angular/router'

@Component({
    selector: 'app-charge',
    templateUrl: './charge.component.html',
    styleUrls: ['./charge.component.scss'],
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
})
export class ChargeComponent implements OnInit, OnDestroy {
    @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>()
    protected huntMeta!: HuntMeta
    protected taskDone = false
    private taskStartTime!: Date
    private chargingStatusCheckInterval: any

    constructor(
        private huntService: HuntService,
        private huntCommunicationService: HuntCommunicationService,
        private toastController: ToastController,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        addIcons({ batteryHalfOutline })
    }

    async ngOnInit() {
        this.huntMeta = await this.huntService.getCurrentHuntMeta()
        this.taskStartTime = new Date()
        await this.startChargeStatus()
    }

    ionViewWillLeave() {
        this.cleanup()
    }

    ngOnDestroy() {
        this.cleanup()
    }

    onCancelHunt() {
        this.resetHunt.emit()
        this.huntService.currentTaskIndex = 0
        this.huntCommunicationService.cancelHunt()
    }

    async continueTask() {
        await this.completeTask()
    }

    private cleanup() {
        if (this.chargingStatusCheckInterval) {
            clearInterval(this.chargingStatusCheckInterval)
        }
        this.taskDone = false
    }

    private async startChargeStatus() {
        try {
            const result = await Device.getBatteryInfo()

            if (result.isCharging) {
                await this.presentToast(
                    'Device is already charging, you can proceed.',
                    'warning',
                    500
                )
                await Haptics.vibrate()
                this.taskDone = true
                this.changeDetectorRef.detectChanges()
            } else {
                this.checkChargingStatus()
            }
        } catch (error) {
            console.error('Failed to get battery info', error)
            await this.failedToGetBatteryInfo()
        }
    }

    private checkChargingStatus() {
        this.chargingStatusCheckInterval = setInterval(async () => {
            try {
                const result = await Device.getBatteryInfo()
                if (result.isCharging) {
                    await Haptics.vibrate()
                    this.taskDone = true
                    this.changeDetectorRef.detectChanges()
                    clearInterval(this.chargingStatusCheckInterval)
                }
            } catch (error) {
                console.error('Failed to get battery info', error)
                await this.failedToGetBatteryInfo()
                clearInterval(this.chargingStatusCheckInterval)
            }
        }, 500)
    }

    private async failedToGetBatteryInfo() {
        await this.presentToast('Failed to get battery info', 'danger')
    }

    private async presentToast(
        message: string,
        color: string,
        duration: number = 1000
    ) {
        const toast = await this.toastController.create({
            message: message,
            duration: duration,
            color: color,
            position: 'top',
        })
        await toast.present()
    }

    private async completeTask() {
        try {
            const endTimeHuntMeta = await this.huntService.getCurrentHuntMeta()
            endTimeHuntMeta.time.end = new Date()

            await this.huntService.saveCurrentHuntMeta(endTimeHuntMeta)
            await this.huntService.completeCurrentTask(this.taskStartTime)

            await this.router.navigate(['/tabs/hunt/finish'])
        } catch (error) {
            console.error('Error completing task', error)
        }
    }
}
