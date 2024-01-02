import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  saveData<T>(key: string, data: T): void {
    localStorage.setItem(key, this.serialize(data));
  }

  getData<T>(key: string): T | null {
    const data = localStorage.getItem(key);

    return data ? this.deserialize(data) : null;
  }

  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  clearData(): void {
    localStorage.clear();
  }

  private serialize<T>(data: T): string {
    if (data instanceof Set) {
      return JSON.stringify(Array.from(data));
    }
    return JSON.stringify(data);
  }

  private deserialize<T>(data: string): T {
    const parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.every(item => typeof item !== 'object')) {
      return new Set(parsedData) as unknown as T;
    }
    return parsedData as T;
  }
}
