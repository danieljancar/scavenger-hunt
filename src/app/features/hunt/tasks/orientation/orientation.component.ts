import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { HuntMeta } from '../../../../types/hunt.types';
import { HuntService } from '../../../../core/data/hunt.service';
import { HuntCommunicationService } from '../../../../core/util/hunt-communication.service';
import { addIcons } from 'ionicons';
import { phonePortraitOutline } from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Haptics } from '@capacitor/haptics';
import { ChangeDetection } from '@angular/cli/lib/config/workspace-schema';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
  standalone: true,
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
  ],
})
export class OrientationComponent implements OnInit {
  @Output() resetHunt: EventEmitter<void> = new EventEmitter<void>();
  protected huntMeta!: HuntMeta;
  protected taskDone = false;
  private taskStartTime!: Date;

  constructor(
    private huntService: HuntService,
    private huntCommunicationService: HuntCommunicationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    addIcons({ phonePortraitOutline });
  }

  async ngOnInit() {
    this.huntMeta = await this.huntService.getCurrentHuntMeta();
    this.taskStartTime = new Date();
    await this.listenForOrientationChange();
  }

  onCancelHunt() {
    this.resetHunt.emit();
    this.huntService.currentTaskIndex = 0;
    this.huntCommunicationService.cancelHunt();
  }

  async continueTask() {
    await this.completeTask();
  }

  private async listenForOrientationChange() {
    try {
      await ScreenOrientation.lock({ orientation: 'any' });

      await ScreenOrientation.addListener(
        'screenOrientationChange',
        async (event) => {
          if (event.type === 'portrait-secondary') {
            await Haptics.vibrate({ duration: 1500 }).then(() => {
              this.taskDone = true;
              this.changeDetectorRef.detectChanges();
            });
          }
        },
      );
    } catch (error) {
      console.error('Failed to lock screen orientation', error);
    }
  }

  private async completeTask() {
    this.taskDone = true;
    await this.huntService.completeCurrentTask(this.taskStartTime);
  }
}
