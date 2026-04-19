import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth';
import { Router } from '@angular/router';

import { HttpService } from 'src/app/core/services/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit  {

  name: string = '';  
  lastName: string = '';
  documentType: string = '';
  documentNumber: string = '';
  country: string = '';
  email: string = '';
  password: string = '';

  departments: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private httpService: HttpService
  ) {}

      ngOnInit() {
      this.loadDepartments();
    }

    loadDepartments() {
      this.httpService.getDepartments().subscribe((data: any) => {
        this.departments = data;
        console.log(this.departments);
      });
    }
  async register() {

    if (
      !this.name ||
      !this.lastName ||
      !this.documentType ||
      !this.documentNumber ||
      !this.country ||
      !this.email ||
      !this.password
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.password.length < 6) {
      alert('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

try {
  const result = await this.authService.register(this.email, this.password, {
    name: this.name,
    lastName: this.lastName,
    documentType: this.documentType,
    documentNumber: this.documentNumber,
    country: this.country
  });

  console.log('Usuario registrado correctamente', result);

} catch (error) {
  console.error(error);
  alert('Error al registrar');
}
  }

}
