import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HuntMeta } from '../../../../types/hunt.types';
import { ActivatedRoute, Router } from '@angular/router';
import {
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
} from '@ionic/angular/standalone';
import { HuntService } from '../../../../core/data/hunt.service';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service';

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
export class GeolocationComponent implements OnInit {
  @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>();
  protected huntMeta!: HuntMeta;
  protected taskDone = true;

  constructor(
    private huntService: HuntService,
    private huntCommunicationService: HuntCommunicationService,
  ) {
    addIcons({ locationOutline });
  }

  async ngOnInit() {
    this.huntMeta = await this.huntService.getCurrentHuntMeta();
  }

  onCancelHunt() {
    this.huntCommunicationService.cancelHunt();
  }

  async continueTask() {
    await this.completeTask();
  }

  private async completeTask() {
    this.taskDone = true;
    await this.huntService.completeCurrentTask();
  }
}
