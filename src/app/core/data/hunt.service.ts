import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { ScavengerHunt, HuntMeta } from '../../types/hunt.types';

@Injectable({
  providedIn: 'root',
})
export class HuntService {
  private readonly HUNTS_KEY = 'hunts';
  private readonly CURRENT_HUNT_KEY = 'currentHunt';
  private readonly tasks = ['geolocation', 'qrcode', 'orientation', 'charge'];
  public currentTaskIndex = 0;

  constructor(private router: Router) {}

  async getHunts(): Promise<ScavengerHunt[]> {
    try {
      const { value } = await Preferences.get({ key: this.HUNTS_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting hunts from Preferences:', error);
      return [];
    }
  }

  async saveHunts(hunts: ScavengerHunt[]): Promise<void> {
    try {
      await Preferences.set({
        key: this.HUNTS_KEY,
        value: JSON.stringify(hunts),
      });
    } catch (error) {
      console.error('Error saving hunts to Preferences:', error);
    }
  }

  async deleteHunt(index: number): Promise<void> {
    try {
      const hunts = await this.getHunts();
      if (index >= 0 && index < hunts.length) {
        hunts.splice(index, 1);
        await this.saveHunts(hunts);
      }
    } catch (error) {
      console.error('Error deleting hunt:', error);
    }
  }

  async startHunt(name: string) {
    const huntMeta: HuntMeta = {
      name: name,
      time: { start: new Date() },
      date: new Date(),
    };

    await Preferences.set({
      key: this.CURRENT_HUNT_KEY,
      value: JSON.stringify(huntMeta),
    });

    await this.navigateToCurrentTask(huntMeta);
  }

  async completeCurrentTask() {
    const huntMeta = await this.getCurrentHuntMeta();
    if (this.currentTaskIndex < this.tasks.length - 1) {
      this.currentTaskIndex++;
      await this.navigateToCurrentTask(huntMeta);
    } else {
      await this.completeHunt(huntMeta);
    }
  }

  async completeHunt(huntMeta: HuntMeta) {
    huntMeta.time.end = new Date();
    await this.router.navigate(['/tabs/hunt/finish'], {
      state: { huntMeta: huntMeta },
    });
  }

  async getCurrentHuntMeta(): Promise<HuntMeta> {
    const { value } = await Preferences.get({ key: this.CURRENT_HUNT_KEY });
    return value ? JSON.parse(value) : null;
  }

  async saveCurrentHuntMeta(huntMeta: HuntMeta): Promise<void> {
    try {
      await Preferences.set({
        key: this.CURRENT_HUNT_KEY,
        value: JSON.stringify(huntMeta),
      });
    } catch (error) {
      console.error('Error saving current hunt meta to Preferences:', error);
    }
  }

  async clearCurrentHuntMeta(): Promise<void> {
    try {
      await Preferences.remove({ key: this.CURRENT_HUNT_KEY });
    } catch (error) {
      console.error(
        'Error clearing current hunt meta from Preferences:',
        error,
      );
    }
  }

  addSamples(): Promise<void> {
    return this.saveHunts([
      {
        name: 'Scavenger Hunt 1',
        rewards: this.randomNum(),
        penalties: this.randomNum(),
        time: {
          start: new Date(),
          end: new Date(),
        },
        date: new Date(),
      },
      {
        name: 'Scavenger Hunt 2',
        rewards: this.randomNum(),
        penalties: this.randomNum(),
        time: {
          start: new Date(),
          end: new Date(),
        },
        date: new Date(),
      },
      {
        name: 'Scavenger Hunt 3',
        rewards: this.randomNum(),
        penalties: this.randomNum(),
        time: {
          start: new Date(),
          end: new Date(),
        },
        date: new Date(),
      },
    ]);
  }

  private randomNum(): number {
    const min = 1;
    const max = 4;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async navigateToCurrentTask(huntMeta: HuntMeta) {
    const task = this.tasks[this.currentTaskIndex];
    await this.router.navigate([`/tabs/hunt/${task}`], {
      state: { huntMeta },
    });
  }
}
