import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  public get(key: string): any {
    let value = localStorage.getItem(key);
    if (typeof (value) != 'object') {
      value = JSON.parse(value);
    }
    if (typeof (value) != 'object') {
      value = JSON.parse(value);
    }
    return value;
  }
  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public reset(): void {
    localStorage.clear();
  }

}
