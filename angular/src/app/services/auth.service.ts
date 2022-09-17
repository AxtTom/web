import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../models/auth';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) { }

  password(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.put('/api/auth', {
        method: 'password',
        username,
        password
      } as Auth).subscribe((res) => {
        
      });
    });
  }

  async loggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.storage.get('token')) {
        this.http.get('/api/auth').subscribe((res) => {
          resolve(true);
        });
      }
      resolve(false);
    });
  }

  getToken(): string {
    return '';
  }
}
