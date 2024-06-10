import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public async getStorageUsage() {
    const { keys } = await Preferences.keys();
    let totalSize = 0;

    for (const key of keys) {
      const { value } = await Preferences.get({ key });
      if (value !== null) {
        totalSize += new Blob([value]).size;
      }
    }

    return totalSize;
  }

  public async clearStorage() {
    await Preferences.clear();
  }
}
