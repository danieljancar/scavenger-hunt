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

  constructor(
    private router: Router,
    private huntService: HuntService,
    private huntCommunicationService: HuntCommunicationService,
  ) {}

  async ngOnInit() {
    const huntMeta = await this.huntService.getCurrentHuntMeta();
    if (huntMeta) {
      this.huntMeta = huntMeta;
      this.huntStarted = true;
    }

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!event.url.includes('/tabs/hunt')) {
          this.resetHunt();
        }
      }
    });

    this.huntCommunicationService.cancelHunt$.subscribe(() => {
      this.resetHunt();
    });
  }

  ionViewWillEnter() {
    this.huntStarted = false;
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
    this.huntStarted = false;
    this.huntMeta = {
      penalties: 0,
      rewards: 0,
      name: '',
      time: {},
      date: new Date(),
    };
    await this.huntService.clearCurrentHuntMeta();
  }
}
