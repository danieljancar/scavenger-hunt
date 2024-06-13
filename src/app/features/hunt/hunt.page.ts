import { Component, OnDestroy, OnInit } from '@angular/core'
import { NavigationStart, Router, RouterOutlet } from '@angular/router'
import { HuntService } from '../../core/data/hunt.service'
import { Subscription } from 'rxjs'
import { HuntMeta } from '../../types/hunt.types'
import { HuntCommunicationService } from '../../core/util/hunt-communication.service'
import {
    AlertController,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonTitle,
    IonToolbar,
    ToastController,
} from '@ionic/angular/standalone'
import { FormsModule } from '@angular/forms'
import { Camera } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'
import { AppLauncher } from '@capacitor/app-launcher'

@Component({
    selector: 'app-hunt',
    templateUrl: 'hunt.page.html',
    styleUrls: ['hunt.page.scss'],
    standalone: true,
    imports: [
        IonTitle,
        IonToolbar,
        IonHeader,
        IonContent,
        IonInput,
        IonItem,
        FormsModule,
        IonButton,
        RouterOutlet,
    ],
})
export class HuntPage implements OnInit, OnDestroy {
    protected huntStarted: boolean = false
    protected huntMeta: HuntMeta = {
        penalties: 0,
        rewards: 0,
        name: '',
        time: {},
        date: new Date(),
    }
    private routerSubscription: Subscription | undefined
    private resetInProgress = false

    constructor(
        private router: Router,
        private huntService: HuntService,
        private huntCommunicationService: HuntCommunicationService,
        private toastController: ToastController,
        private alertController: AlertController
    ) {}

    ngOnInit() {
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (
                event instanceof NavigationStart &&
                !event.url.includes('/tabs/hunt')
            ) {
                this.resetHunt()
            }
        })

        this.huntCommunicationService.cancelHunt$.subscribe(() => {
            if (!this.resetInProgress) {
                this.showCancelToastAndReset()
            }
        })
    }

    ngOnDestroy() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe()
        }
    }

    async startHunt() {
        let geolocationStatus = await Geolocation.requestPermissions({
            permissions: ['location'],
        })
        let cameraStatus = await Camera.requestPermissions({
            permissions: ['camera'],
        })

        if (
            geolocationStatus.location !== 'granted' ||
            cameraStatus.camera !== 'granted'
        ) {
            await this.alertController
                .create({
                    header: 'Permissions Required',
                    message:
                        'Please allow access to your location and camera in your settings to start a hunt.',
                    buttons: [
                        {
                            text: 'OK',
                            role: 'cancel',
                            handler: () => {
                                this.resetHunt()
                            },
                        },
                        {
                            text: 'Go to Settings',
                            handler: () => {
                                AppLauncher.openUrl({
                                    url: 'app-settings:root=General',
                                }).then(() => {
                                    this.resetHunt()
                                })
                            },
                        },
                    ],
                })
                .then((alert) => alert.present())
        } else {
            if (!this.huntMeta.time) {
                this.huntMeta.time = {}
            }
            this.huntMeta.time.start = new Date()
            this.huntMeta.date = new Date()

            const huntStarted = await this.huntService.startHunt(
                this.huntMeta.name
            )

            if (!huntStarted) {
                this.alertController
                    .create({
                        header: 'Hunt Name Exists',
                        message:
                            'A hunt with the name ' +
                            this.huntMeta.name +
                            ' already exists. Please choose a different name.',
                        buttons: ['OK'],
                    })
                    .then((alert) => alert.present())
                return
            }

            this.router
                .navigate(['/tabs/hunt/geolocation'], {
                    state: { huntMeta: this.huntMeta },
                })
                .then(() => {
                    this.huntStarted = true
                })
        }
    }

    async resetHunt() {
        if (this.resetInProgress) {
            return
        }
        this.resetInProgress = true
        this.huntStarted = false
        this.huntMeta = {
            penalties: 0,
            rewards: 0,
            name: '',
            time: {},
            date: new Date(),
        }
        await this.huntService.clearCurrentHuntMeta()
        this.huntService.currentTaskIndex = 0
        this.huntCommunicationService.cancelHunt()
        this.resetInProgress = false
    }

    private async showCancelToastAndReset() {
        this.toastController
            .create({
                message: this.huntMeta.name + ' has been canceled',
                duration: 2000,
                position: 'top',
            })
            .then((toast) => {
                toast.present().then(() => {
                    this.resetInProgress = false
                    this.resetHunt()
                })
            })
    }
}
