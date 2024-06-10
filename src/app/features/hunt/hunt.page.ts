import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HuntMeta } from '../../types/hunt.types';
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
  standalone: true,
  styleUrls: ['hunt.page.scss'],
  imports: [
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonButton,
    FormsModule,
    IonInput,
    IonItem,
    RouterOutlet,
  ],
})
export class HuntPage {
  protected huntStarted: boolean = false;
  protected huntMeta: HuntMeta = {
    name: '',
    time: {},
    date: new Date(),
  };

  constructor(private router: Router) {}

  startHunt() {
    if (!this.huntMeta.time) {
      this.huntMeta.time = {};
    }
    this.huntMeta.time.start = new Date();
    this.huntMeta.date = new Date();

    this.router
      .navigate(['/tabs/hunt/geolocation'], {
        state: { huntMeta: this.huntMeta },
      })
      .then(() => {
        this.huntStarted = true;
      });
  }
}
