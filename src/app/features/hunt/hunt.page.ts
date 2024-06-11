import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HuntService } from '../../core/data/hunt.service';
import { Subscription } from 'rxjs';
import { HuntMeta } from '../../types/hunt.types';
import { HuntCommunicationService } from '../../core/util/hunt-communication.service';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

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
  protected huntStarted: boolean = false;
  protected huntMeta: HuntMeta = {
    penalties: 0,
    rewards: 0,
    name: '',
    time: {},
    date: new Date(),
  };
  private routerSubscription: Subscription | undefined;
  private resetInProgress = false;

  constructor(
    private router: Router,
    private huntService: HuntService,
    private huntCommunicationService: HuntCommunicationService,
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationStart &&
        !event.url.includes('/tabs/hunt')
      ) {
        this.resetHunt();
      }
    });

    this.huntCommunicationService.cancelHunt$.subscribe(() => {
      if (!this.resetInProgress) {
        this.resetHunt();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async startHunt() {
    if (!this.huntMeta.time) {
      this.huntMeta.time = {};
    }
    this.huntMeta.time.start = new Date();
    this.huntMeta.date = new Date();

    await this.huntService.saveCurrentHuntMeta(this.huntMeta);

    this.router
      .navigate(['/tabs/hunt/geolocation'], {
        state: { huntMeta: this.huntMeta },
      })
      .then(() => {
        this.huntStarted = true;
      });
  }

  async resetHunt() {
    if (this.resetInProgress) {
      return;
    }
    this.resetInProgress = true;
    console.log('Hunt reset');
    this.huntStarted = false;
    this.huntMeta = {
      penalties: 0,
      rewards: 0,
      name: '',
      time: {},
      date: new Date(),
    };
    await this.huntService.clearCurrentHuntMeta();
    this.huntService.currentTaskIndex = 0;
    this.huntCommunicationService.cancelHunt();
    this.resetInProgress = false;
  }
}
