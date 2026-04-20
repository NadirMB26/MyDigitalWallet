import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  isGoogleLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    if (!this.email || !this.password) {
      await this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.password);
      await this.showToast('¡Bienvenido de nuevo!', 'success');
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      const msg = this.getFirebaseError(error.code);
      await this.showToast(msg, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async loginGoogle() {
    this.isGoogleLoading = true;
    try {
      await this.authService.loginWithGoogle();
      await this.showToast('¡Bienvenido!', 'success');
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      await this.showToast('Error al iniciar con Google', 'danger');
    } finally {
      this.isGoogleLoading = false;
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    await toast.present();
  }

  private getFirebaseError(code: string): string {
    switch (code) {
      case 'auth/user-not-found': return 'Usuario no encontrado';
      case 'auth/wrong-password': return 'Contraseña incorrecta';
      case 'auth/invalid-email': return 'Correo inválido';
      case 'auth/too-many-requests': return 'Demasiados intentos, intenta más tarde';
      case 'auth/invalid-credential': return 'Credenciales inválidas';
      default: return 'Error al iniciar sesión';
    }
  }
}