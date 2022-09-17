import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeComponent } from './home/home.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { PolicyComponent } from './policy/policy.component';
import { ImprintComponent } from './imprint/imprint.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { HttpInterceptorService } from './services/http-interceptor.service';

const config: SocketIoConfig = {
  url: 'http://localhost:8080'
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PolicyComponent,
    ImprintComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
