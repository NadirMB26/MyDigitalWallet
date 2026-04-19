
import { Component, OnInit } from '@angular/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {

  async ngOnInit() {
    await SocialLogin.initialize({
      google: {
        webClientId: environment.googleWebClientId, // guárdalo en environment
      },
    });
  }
}