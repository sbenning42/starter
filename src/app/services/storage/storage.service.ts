import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getAll(): Observable<{[key: string]: string}> {
    let key;
    let index = -1;
    const storage = {};
    while ((key = localStorage.key(++index))) {
      storage[key] = localStorage.getItem(key);
    }
    return of(storage);
  }
  setAll(storage: {[key: string]: string}): Observable<{[key: string]: string}> {
    Object.entries(storage).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    return of(storage);
  }
}
