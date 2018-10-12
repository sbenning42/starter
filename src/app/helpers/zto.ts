export class CrudManager {
  static read(collection: any[]): any[] {
    return [...collection];
  }
  static readOne(collection: any[], selector: (item: any) => boolean): any {
    return collection.find(selector);
  }
  static create(collection: any[], item: any): any {
    collection.push(item);
    return item;
  }
  static update(collection: any[], selector: (item: any) => boolean, payload: any): any {
    const index = collection.findIndex(selector);
    const item = {
      ...collection[index],
      ...payload,
    };
    collection[index] = item;
    return this.read(collection);
  }
  static del(collection: any[], selector: (item: any) => boolean): any[] {
    return collection.filter(selector);
  }
}

export class Uuid {
// tslint:disable:no-bitwise
constructor() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  // tslint:enable:no-bitwise
}
