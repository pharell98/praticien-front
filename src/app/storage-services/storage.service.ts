// storage.service.ts
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  setItem(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null; // ou une valeur par défaut
  }

  clear(): void {
    if (this.isBrowser()) {
      localStorage.clear(); // Efface tous les éléments
    }
  }
  clearItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
