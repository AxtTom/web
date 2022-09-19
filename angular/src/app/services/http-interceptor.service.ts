import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private storage: Storage,
    private auth: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.loggedIn().mer
  }

  private async handle(req: HttpRequest<any>, next: HttpHandler) {
    if (await this.auth.loggedIn()) {
      req.headers.set('Authorization', this.auth.getToken());
    }
    return next.handle(req).toPromise();
  }
}
