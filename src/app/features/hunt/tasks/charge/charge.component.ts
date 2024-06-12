import { Component, EventEmitter, OnInit, Output } from '@angular/core'
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
export class ChargeComponent implements OnInit {
    @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>()
    protected huntMeta!: HuntMeta
    protected taskDone = false
    private taskStartTime!: Date

    constructor(
        private huntService: HuntService,
        private huntCommunicationService: HuntCommunicationService,
        private toastController: ToastController
    ) {
        addIcons({ batteryHalfOutline })
    }

    async ngOnInit() {
        this.huntMeta = await this.huntService.getCurrentHuntMeta()
        this.taskStartTime = new Date()
        await this.startChargeStatus()
    }

    onCancelHunt() {
        this.resetHunt.emit()
        this.huntService.currentTaskIndex = 0
        this.huntCommunicationService.cancelHunt()
    }

    async continueTask() {
        await this.completeTask()
    }

    public async startChargeStatus() {
        try {
            const result = await Device.getBatteryInfo()

            if (result.isCharging) {
                this.toastController
                    .create({
                        message: 'Device is already charging, task completed',
                        duration: 2000,
                        color: 'warning',
                        position: 'top',
                    })
                    .then((t) => t.present())
                await this.completeTask()
            } else {
                await this.checkChargingStatus()
            }
        } catch (error) {
            console.error('Failed to get battery info', error)
            this.failedToGetBatteryInfo()
        }
    }

    private async checkChargingStatus() {
        let isCharging: boolean | undefined = false

        while (!isCharging) {
            await new Promise((resolve) => setTimeout(resolve, 500))

            try {
                const result = await Device.getBatteryInfo()
                isCharging = result.isCharging
            } catch (error) {
                console.error('Failed to get battery info', error)
                this.failedToGetBatteryInfo()
                return
            }
        }

        await this.completeTask()
    }

    private failedToGetBatteryInfo() {
        this.toastController
            .create({
                message: 'Failed to get battery info',
                duration: 2000,
                color: 'danger',
                position: 'top',
            })
            .then((t) => t.present())
    }

    private async completeTask() {
        await Haptics.vibrate().then(() => {
            this.taskDone = true
        })
        const endTimeHuntMeta = await this.huntService.getCurrentHuntMeta()
        endTimeHuntMeta.time.end = new Date()
        await this.huntService.saveCurrentHuntMeta(endTimeHuntMeta)
        await this.huntService.completeCurrentTask(this.taskStartTime)
    }
}
