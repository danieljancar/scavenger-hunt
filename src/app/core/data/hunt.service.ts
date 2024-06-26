import { Injectable } from '@angular/core'
import { Preferences } from '@capacitor/preferences'
import { Router } from '@angular/router'
import { HuntMeta, ScavengerHunt } from '../../types/hunt.types'
import { AlertController, ToastController } from '@ionic/angular/standalone'
import { HuntCommunicationService } from '../util/hunt-communication.service'

@Injectable({
    providedIn: 'root',
})
export class HuntService {
    public currentTaskIndex = 0
    private readonly HUNTS_KEY = 'hunts'
    private readonly CURRENT_HUNT_KEY = 'currentHunt'
    private readonly tasks = ['geolocation', 'qrcode', 'orientation', 'charge']
    private huntSampleNames = [
        'Eagle Eye',
        'Night Hawk',
        'Lion Heart',
        'Shadow Fox',
        'Silver Serpent',
        'Golden Dragon',
        'Emerald Tiger',
        'Ruby Raven',
        'Sapphire Wolf',
        'Diamond Dolphin',
    ]

    constructor(
        private router: Router,
        private alertController: AlertController,
        private huntCommunicationService: HuntCommunicationService,
        private toastController: ToastController
    ) {}

    async getHunts(): Promise<ScavengerHunt[]> {
        try {
            const { value } = await Preferences.get({ key: this.HUNTS_KEY })
            return value ? JSON.parse(value) : []
        } catch (error) {
            this.alertController
                .create({
                    header: 'Error',
                    message: 'Error getting hunts from Preferences',
                    buttons: ['OK'],
                })
                .then((alert) => alert.present())
                .finally(() => {
                    this.router.navigate(['/tabs/hunt']).then(() => {
                        console.error(
                            'Error getting hunts from Preferences',
                            error
                        )
                        this.huntCommunicationService.cancelHunt()
                    })
                })
            return []
        }
    }

    async saveHunts(hunts: ScavengerHunt[]): Promise<void> {
        try {
            await Preferences.set({
                key: this.HUNTS_KEY,
                value: JSON.stringify(hunts),
            })
        } catch (error) {
            this.alertController
                .create({
                    header: 'Error',
                    message: 'Error saving hunts to Preferences',
                    buttons: ['OK'],
                })
                .then((alert) => alert.present())
                .finally(() => {
                    this.router.navigate(['/tabs/hunt']).then(() => {
                        console.error(
                            'Error saving hunts to Preferences',
                            error
                        )
                        this.huntCommunicationService.cancelHunt()
                    })
                })
        }
    }

    async deleteHunt(index: number): Promise<void> {
        try {
            const hunts = await this.getHunts()
            if (index >= 0 && index < hunts.length) {
                hunts.splice(index, 1)
                await this.saveHunts(hunts)
            }
        } catch (error) {
            this.alertController
                .create({
                    header: 'Error',
                    message: 'Error deleting hunt from Preferences',
                    buttons: ['OK'],
                })
                .then((alert) => alert.present())
                .finally(() => {
                    this.router.navigate(['/tabs/hunt']).then(() => {
                        console.error(
                            'Error deleting hunt from Preferences',
                            error
                        )
                        this.huntCommunicationService.cancelHunt()
                    })
                })
        }
    }

    async startHunt(name: string): Promise<boolean> {
        const hunts: ScavengerHunt[] = await this.getHunts()

        if (hunts.some((hunt) => hunt.name === name)) {
            return false
        }

        const huntMeta: HuntMeta = {
            name: name,
            rewards: 0,
            penalties: 0,
            time: { start: new Date() },
            date: new Date(),
        }

        await Preferences.set({
            key: this.CURRENT_HUNT_KEY,
            value: JSON.stringify(huntMeta),
        })

        return true
    }

    async completeCurrentTask(taskStartTime: Date) {
        const huntMeta = await this.getCurrentHuntMeta()
        const taskEndTime = new Date()
        const { rewards, penalties } = this.calculateRewardsAndPenalties(
            taskStartTime,
            taskEndTime
        )

        huntMeta.rewards += rewards
        huntMeta.penalties += penalties

        await this.saveCurrentHuntMeta(huntMeta)

        if (this.currentTaskIndex < this.tasks.length - 1) {
            this.currentTaskIndex++
            await this.navigateToCurrentTask(huntMeta)
        } else {
            await this.completeHunt(huntMeta)
        }
    }

    async completeHunt(huntMeta: HuntMeta) {
        huntMeta.time.end = new Date()
        await this.saveCurrentHuntMeta(huntMeta)
    }

    async getCurrentHuntMeta(): Promise<HuntMeta> {
        const { value } = await Preferences.get({ key: this.CURRENT_HUNT_KEY })
        return value ? JSON.parse(value) : null
    }

    async saveCurrentHuntMeta(huntMeta: HuntMeta): Promise<void> {
        try {
            await Preferences.set({
                key: this.CURRENT_HUNT_KEY,
                value: JSON.stringify(huntMeta),
            })
        } catch (error) {
            this.toastController
                .create({
                    message: 'Error saving current hunt meta to Preferences',
                    duration: 2000,
                    position: 'bottom',
                    color: 'danger',
                })
                .then((toast) => toast.present())
                .finally(() => {
                    this.router.navigate(['/tabs/hunt']).then(() => {
                        console.error(
                            'Error saving current hunt meta to Preferences',
                            error
                        )
                        this.huntCommunicationService.cancelHunt()
                    })
                })
        }
    }

    async clearCurrentHuntMeta(): Promise<void> {
        try {
            console.log('clearing hunt meta')
            await Preferences.remove({ key: this.CURRENT_HUNT_KEY })
        } catch (error) {
            this.toastController
                .create({
                    message:
                        'Error clearing current hunt meta from Preferences',
                    duration: 2000,
                    position: 'bottom',
                    color: 'danger',
                })
                .then((toast) => toast.present())
                .finally(() => {
                    console.error(
                        'Error clearing current hunt meta from Preferences',
                        error
                    )
                    this.huntCommunicationService.cancelHunt()
                })
        }
    }

    addSamples(): Promise<void> {
        return this.saveHunts([
            this.createRandomHunt(),
            this.createRandomHunt(),
            this.createRandomHunt(),
        ])
    }

    calculateRewardsAndPenalties(
        startTime: Date,
        endTime: Date
    ): { rewards: number; penalties: number } {
        const duration = (endTime.getTime() - startTime.getTime()) / 1000 // Duration in seconds
        let rewards = 0
        let penalties = 0

        if (duration <= 15) {
            rewards = 1
        } else {
            rewards = 1
            penalties = 1
        }

        return { rewards, penalties }
    }

    private randomNum(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    private async navigateToCurrentTask(huntMeta: HuntMeta) {
        const task = this.tasks[this.currentTaskIndex]
        await this.router.navigate([`/tabs/hunt/${task}`], {
            state: { huntMeta },
        })
    }

    private createRandomHunt(): ScavengerHunt {
        const randomName =
            this.huntSampleNames[
                this.randomNum(0, this.huntSampleNames.length - 1)
            ]
        const startTime = new Date()
        const endTime = new Date(
            startTime.getTime() + this.randomNum(1, 10) * 1000
        )
        return {
            name: randomName,
            rewards: this.randomNum(1, 10),
            penalties: this.randomNum(1, 10),
            time: {
                start: startTime,
                end: endTime,
            },
            date: startTime,
        }
    }
}
