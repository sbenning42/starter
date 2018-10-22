import { Component, OnInit } from '@angular/core';
import { StorageFacade } from 'src/app/store/storage/facade';
import { StorageState } from 'src/app/store/storage/state';
import { Observable } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-storage-facade',
  templateUrl: './storage-facade.component.html',
  styleUrls: ['./storage-facade.component.css']
})
export class StorageFacadeComponent implements OnInit {

  storage$: Observable<[string, string][]> = this.storage.storage$.pipe(
    map((storage: {[id: string]: string}) => Object.entries(storage)),
  );
  loaded$: Observable<boolean> = this.storage.loaded$;

  key = '';
  value = '';

  constructor(public storage: StorageFacade) { }

  ngOnInit() {
  }

  load() {
    this.storage.load('StorageFacadeComponent.load');
  }

  save() {
    this.storage$.pipe(first()).subscribe((storage: [string, string][]) => {
      this.storage.save({
        ...storage.map(pair => ({[pair[0]]: pair[1]})).reduce((acc, pair) => ({...acc, ...pair}), {}),
        [this.key]: this.value
      });
      this.key = '';
      this.value = '';
    });
  }

  delete(key: string) {
    this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }

}
