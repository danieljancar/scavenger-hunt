import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { HuntMeta, ScavengerHunt } from '../../../types/hunt.types';
import { HuntService } from '../../../core/data/hunt.service';
import { HuntCommunicationService } from '../../../core/util/hunt-communication.service';
import { addIcons } from 'ionicons';
import { batteryHalfOutline, happyOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { DateTimePipe } from '../../../pipes/date.pipe';
import { DatePipe } from '@angular/common';

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
    IonNote,
    DateTimePipe,
    DatePipe,
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
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    addIcons({ happyOutline });
  }

  async ngOnInit() {
    this.huntMeta = await this.huntService.getCurrentHuntMeta();
  }

  async ionViewWillLeave() {
    this.resetHunt.emit();
    this.huntCommunicationService.cancelHunt();
    await this.huntService.clearCurrentHuntMeta();
    this.huntService.currentTaskIndex = 0;
  }

  onCancelHunt() {
    this.resetHunt.emit();
    this.huntService.currentTaskIndex = 0;
    this.huntCommunicationService.cancelHunt();
  }

  async saveHunt() {
    const huntMeta = await this.huntService.getCurrentHuntMeta();

    if (huntMeta.time.start && huntMeta.time.end && huntMeta.date) {
      const scavengerHunt: ScavengerHunt = {
        name: huntMeta.name,
        rewards: huntMeta.rewards,
        penalties: huntMeta.penalties,
        time: {
          start: huntMeta.time.start,
          end: huntMeta.time.end,
        },
        date: huntMeta.date,
      };

      const hunts = await this.huntService.getHunts();
      hunts.push(scavengerHunt);

      await this.huntService.saveHunts(hunts);
      this.resetHunt.emit();
      await this.router.navigate(['/tabs/home']).then(() => {
        this.toastController
          .create({
            message: this.huntMeta.name + ' has been saved!',
            duration: 2000,
            color: 'success',
            position: 'top',
          })
          .then((toast) => {
            toast.present();
          });
      });
    } else {
      this.toastController
        .create({
          message: 'An error occurred while saving the hunt.',
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((t) => {
          t.present();
        })
        .finally(() => {
          this.resetHunt.emit();
          this.huntService.currentTaskIndex = 0;
          this.huntCommunicationService.cancelHunt();
          this.discardHunt();
        });
    }
  }

  async discardHunt() {
    this.alertController
      .create({
        header: 'Discard Hunt',
        message: 'Are you sure you want to discard the hunt?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Discard',
            handler: async () => {
              this.resetHunt.emit();
              await this.huntService.clearCurrentHuntMeta();
              this.huntService.currentTaskIndex = 0;
              await this.router.navigate(['/tabs/home']);
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
