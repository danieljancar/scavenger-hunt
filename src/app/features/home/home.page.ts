import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonAccordion,
  IonAccordionGroup,
  IonList,
  IonButton,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonNote,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import {
  calendarOutline,
  medalOutline,
  skullOutline,
  stopwatchOutline,
  trashOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ScavengerHunt } from '../../types/hunt.types';
import { HuntService } from '../../core/data/hunt.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { DateTimePipe } from '../../pipes/date.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { FeedbackIconType } from '../../enums/feedback. enums';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonList,
    IonButton,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    FeedbackComponent,
    FeedbackComponent,
    DateTimePipe,
    IonNote,
    LoadingComponent,
  ],
})
export class HomePage implements OnInit {
  protected hunts: ScavengerHunt[] = [];
  protected isLoading = true;
  protected readonly FeedbackIcon = FeedbackIconType;

  constructor(
    private huntService: HuntService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    addIcons({
      trashOutline,
      medalOutline,
      skullOutline,
      stopwatchOutline,
      calendarOutline,
    });
  }

  async ngOnInit() {
    await this.loadHunts();
  }

  async ionViewWillEnter() {
    await this.refreshHunts();
  }

  async loadHunts() {
    this.isLoading = true;
    try {
      this.hunts = await this.huntService.getHunts().then((hunts) => {
        this.isLoading = false;
        return hunts;
      });
    } catch (error) {
      this.isLoading = false;
      await this.toastController
        .create({
          message: 'Failed to load scavenger hunts',
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((t) => t.present());
    }
  }

  async refreshHunts() {
    await this.loadHunts();
  }

  async deleteHunt(index: number) {
    await this.alertController
      .create({
        header: 'Delete Scavenger Hunt',
        message: 'Are you sure you want to delete this scavenger hunt?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => this.deleteHuntAction(index),
          },
        ],
      })
      .then((a) => a.present());
  }

  addSamples() {
    this.huntService.addSamples().then(() => {
      this.loadHunts().then(() => {
        this.toastController
          .create({
            message: 'Sample hunts added',
            duration: 2000,
            color: 'success',
            position: 'top',
          })
          .then((t) => t.present());
      });
    });
  }

  private async deleteHuntAction(index: number) {
    try {
      await this.huntService.deleteHunt(index).then(async () => {
        this.hunts = await this.huntService.getHunts();
      });
      await this.toastController
        .create({
          message: 'Scavenger hunt deleted',
          duration: 2000,
          color: 'success',
          position: 'top',
        })
        .then((t) => t.present());
    } catch (error) {
      await this.toastController
        .create({
          message: 'Failed to delete scavenger hunt',
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((t) => t.present());
    }
  }
}
