import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: false
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
              private router: Router
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      console.log('Login exitoso');
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.error(error);
    }
  }

  async loginGoogle() {
     alert('BOTÓN PRESIONADO');
    try {
      await this.authService.loginWithGoogle();
      console.log('Login con Google OK');
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      console.error(error);
      alert('ERROR: ' + (error?.message || JSON.stringify(error)));
    }
  }
}