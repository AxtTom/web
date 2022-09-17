import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular';
  loggedIn = false;
  displayName = '';

  constructor(
    private socket: Socket,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.socket.on('connection', () => {
      console.log('connected!');
    });

    this.auth.loggedIn().then((loggedIn) => {
      this.loggedIn = loggedIn;
    });
  }
}
