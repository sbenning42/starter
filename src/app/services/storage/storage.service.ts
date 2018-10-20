import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

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
    return of(storage).pipe(
      delay(2000),
      // switchMap(() => throwError(new Error('MOUHAHAHA')))
    );
  }
  setAll(storage: {[key: string]: string}): Observable<{[key: string]: string}> {
    Object.entries(storage).forEach(([key, value]) => {
      this.storageObj.setItem(key, value);
    });
    return of(storage).pipe(
      delay(2000),
    );
  }
  getItem(key: string): Observable<string> {
    return of(this.storageObj.getItem(key)).pipe(
      delay(2000),
    );
  }
  setItem(key: string, value: string): Observable<string> {
    this.storageObj.setItem(key, value);
    return of(value).pipe(
      delay(2000),
    );
  }
  removeItem(key: string): Observable<string> {
    this.storageObj.removeItem(key);
    return of(key).pipe(
      delay(2000),
    );
  }
  clear(): Observable<string[]> {
    const keys = Object.keys(this.getAll());
    this.storageObj.clear();
    return of(keys).pipe(
      delay(2000),
    );
  }
}
