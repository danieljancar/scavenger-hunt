import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HuntMeta } from '../../../types/hunt.types';
import { HuntService } from '../../../core/data/hunt.service';
import { HuntCommunicationService } from '../../../core/util/hunt-communication.service';
import { addIcons } from 'ionicons';
import { batteryHalfOutline, happyOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss'],
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
    IonList,
  ],
  standalone: true,
})
export class FinishComponent implements OnInit {
  @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>();
  protected huntMeta!: HuntMeta;
  protected taskDone = true;

  constructor(
    private huntService: HuntService,
    private huntCommunicationService: HuntCommunicationService,
    private router: Router,
  ) {
    addIcons({ happyOutline });
  }

  async ngOnInit() {
    this.huntMeta = await this.huntService.getCurrentHuntMeta();
  }

  async ionViewWillLeave() {
    this.resetHunt.emit();
    await this.huntService.clearCurrentHuntMeta();
    this.huntService.currentTaskIndex = 0;
  }

  onCancelHunt() {
    this.huntCommunicationService.cancelHunt();
  }

  async saveHunt() {
    const huntMeta = await this.huntService.getCurrentHuntMeta();
    this.huntService.currentTaskIndex = 0;
    await this.huntService.saveHunts([]);
    this.resetHunt.emit();
    this.router.navigate(['/tabs/home']);
  }

  async discardHunt() {
    await this.huntService.clearCurrentHuntMeta();
    this.huntService.currentTaskIndex = 0;
    this.resetHunt.emit();
    this.router.navigate(['/tabs/home']);
  }
}
