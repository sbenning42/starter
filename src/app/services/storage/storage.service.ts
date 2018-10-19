import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface StorageStrategy {
  key: (index: number) => string;
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageObj: StorageStrategy;

  constructor() {
    this.patchWith(localStorage);
  }

  patchWith(storage: StorageStrategy) {
    this.storageObj = storage;
  }

  getAll(): Observable<{[key: string]: string}> {
    let key;
    let index = -1;
    const storage = {};
    while ((key = this.storageObj.key(++index))) {
      storage[key] = this.storageObj.getItem(key);
    }
    return of(storage);
  }
  setAll(storage: {[key: string]: string}): Observable<{[key: string]: string}> {
    Object.entries(storage).forEach(([key, value]) => {
      this.storageObj.setItem(key, value);
    });
    return of(storage);
  }
  getItem(key: string): Observable<string> {
    return of(this.storageObj.getItem(key));
  }
  setItem(key: string, value: string): Observable<string> {
    this.storageObj.setItem(key, value);
    return of(value);
  }
  removeItem(key: string): Observable<string> {
    this.storageObj.removeItem(key);
    return of(key);
  }
  clear(): Observable<string[]> {
    const keys = Object.keys(this.getAll());
    this.storageObj.clear();
    return of(keys);
  }
}
