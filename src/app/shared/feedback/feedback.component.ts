import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  bugOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { FeedbackIconType } from '../../enums/feedback. enums';

/**
 * A component to display feedback messages.
 *
 * @example
 * <app-feedback icon="alertCircleOutline" title="Error" message="An error occurred."></app-feedback>
 */
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  imports: [IonicModule],
  standalone: true,
})
export class FeedbackComponent {
  @Input() icon: FeedbackIconType = FeedbackIconType.INFO;
  @Input() title: string = 'Feedback';
  @Input() message: string = 'This is a feedback message.';

  constructor() {
    addIcons({ informationCircleOutline, alertCircleOutline, bugOutline });
  }
}
