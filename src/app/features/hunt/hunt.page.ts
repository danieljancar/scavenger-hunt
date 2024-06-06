import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'hunt.page.html',
  styleUrls: ['hunt.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HuntPage {
  constructor() {}
}
