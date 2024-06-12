import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { HuntMeta } from '../../../../types/hunt.types'
import { HuntService } from '../../../../core/data/hunt.service'
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service'
import { addIcons } from 'ionicons'
import { batteryHalfOutline, cameraOutline } from 'ionicons/icons'
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
} from '@ionic/angular/standalone'

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
    protected taskDone = true
    private taskStartTime!: Date

    constructor(
        private huntService: HuntService,
        private huntCommunicationService: HuntCommunicationService
    ) {
        addIcons({ batteryHalfOutline })
    }

    async ngOnInit() {
        this.huntMeta = await this.huntService.getCurrentHuntMeta()
        this.taskStartTime = new Date()
    }

    onCancelHunt() {
        this.resetHunt.emit()
        this.huntService.currentTaskIndex = 0
        this.huntCommunicationService.cancelHunt()
    }

    async continueTask() {
        await this.completeTask()
    }

    private async completeTask() {
        this.taskDone = true
        const endTimeHuntMeta = await this.huntService.getCurrentHuntMeta()
        endTimeHuntMeta.time.end = new Date()
        await this.huntService.saveCurrentHuntMeta(endTimeHuntMeta)
        await this.huntService.completeCurrentTask(this.taskStartTime)
    }
}
