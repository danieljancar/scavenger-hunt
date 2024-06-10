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
import { ToastService } from '../../util/toast.service';
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
    private toastService: ToastService,
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
      await this.toastService
        .presentError('Failed to load scavenger hunts')
        .then(() => {
          this.isLoading = false;
          this.refreshHunts();
        });
    }
  }

  async refreshHunts() {
    await this.loadHunts();
  }

  async deleteHunt(index: number) {
    try {
      await this.huntService.deleteHunt(index);
      this.hunts = await this.huntService.getHunts();
      await this.toastService.presentSuccess('Scavenger hunt deleted');
    } catch (error) {
      await this.toastService.presentError('Failed to delete scavenger hunt');
    }
  }

  addSamples() {
    this.huntService.addSamples().then(() => {
      this.loadHunts();
    });
  }
}
