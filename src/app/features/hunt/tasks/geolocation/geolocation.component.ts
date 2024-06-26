import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { HuntMeta } from '../../../../types/hunt.types'
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
} from '@ionic/angular/standalone'
import { HuntService } from '../../../../core/data/hunt.service'
import { addIcons } from 'ionicons'
import { locationOutline } from 'ionicons/icons'
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service'
import { Geolocation, Position } from '@capacitor/geolocation'
import { Haptics } from '@capacitor/haptics'

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
export class GeolocationComponent implements OnInit, OnDestroy {
    @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>()
    protected huntMeta!: HuntMeta
    protected taskDone = false
    private taskStartTime!: Date
    private targetLatitude = 47.072007
    private targetLongitude = 8.348967
    private proximityThreshold = 20 // In meters
    private watchPositionId: string | undefined

    constructor(
        private huntService: HuntService,
        private huntCommunicationService: HuntCommunicationService,
        private alertController: AlertController,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        addIcons({ locationOutline })
    }

    async ngOnInit() {
        this.huntMeta = await this.huntService.getCurrentHuntMeta()
        this.taskStartTime = new Date()
        this.startLocationChecks()
    }

    onCancelHunt() {
        this.resetHunt.emit()
        this.huntService.currentTaskIndex = 0
        this.huntCommunicationService.cancelHunt()
        this.clearLocationWatch()
    }

    async continueTask() {
        if (this.taskDone) {
            await this.completeTask()
        }
    }

    ngOnDestroy() {
        this.clearLocationWatch()
    }

    private startLocationChecks() {
        Geolocation.checkPermissions().then(async (status) => {
            if (status) {
                this.watchPositionId = await Geolocation.watchPosition(
                    {
                        enableHighAccuracy: true,
                        maximumAge: 1000,
                    },
                    (position, error) => {
                        if (error) {
                            console.error(
                                'Error while watching position:',
                                error
                            )
                            return
                        } else if (position) {
                            this.checkProximity(position)
                        }
                    }
                )
            } else {
                await this.presentPermissionDeniedAlert()
            }
        })
    }

    private checkProximity(position: Position) {
        const distance = this.calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            this.targetLatitude,
            this.targetLongitude
        )
        if (distance <= this.proximityThreshold) {
            this.clearLocationWatch()
            this.taskDone = true
            Haptics.vibrate()
            this.changeDetectorRef.detectChanges()
        }
    }

    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371e3 // Earth radius in meters
        const φ1 = (lat1 * Math.PI) / 180
        const φ2 = (lat2 * Math.PI) / 180
        const Δφ = ((lat2 - lat1) * Math.PI) / 180
        const Δλ = ((lon2 - lon1) * Math.PI) / 180

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c // Distance in meters
    }

    private async presentPermissionDeniedAlert() {
        await this.alertController
            .create({
                header: 'Location Permission Required',
                message:
                    'Please grant permission to access your device location to proceed with the hunt.',
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
            .then((alert) => alert.present())
    }

    private clearLocationWatch() {
        if (this.watchPositionId) {
            Geolocation.clearWatch({ id: this.watchPositionId })
        }
    }

    private async completeTask() {
        await this.huntService.completeCurrentTask(this.taskStartTime)
        this.resetHunt.emit()
    }
}
