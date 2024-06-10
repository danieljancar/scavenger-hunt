import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ScavengerHunt } from '../../types/hunt.types';

@Injectable({
  providedIn: 'root',
})
export class HuntService {
  private readonly HUNTS_KEY = 'hunts';

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
}
