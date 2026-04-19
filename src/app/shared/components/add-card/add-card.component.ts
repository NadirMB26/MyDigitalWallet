import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';
import { CardService } from 'src/app/core/services/card.service';

@Component({
  selector: 'app-add-card-modal',
  templateUrl: './add-card-modal.component.html',
  styleUrls: ['./add-card-modal.component.scss'],
  standalone: false,
})
export class AddCardModalComponent {
  cardholderName = '';
  cardNumber = '';
  expiryDate = '';
  cvc = '';

  constructor(private modalCtrl: ModalController,private cardService: CardService,public auth: AuthService) {}
  
addCard() {
  if (!this.cardholderName || !this.cardNumber || !this.expiryDate || !this.cvc) {
    console.log('Por favor completa todos los campos');
    return;
  }

  if (!this.validateLuhn(this.cardNumber)) {
    console.log('Número de tarjeta inválido');
    return;
  }

  const brand = this.detectBrand(this.cardNumber);

  const newCard = {
    cardholderName: this.cardholderName,
    cardNumber: this.cardNumber.replace(/\s+/g, ''), 
    expiryDate: this.expiryDate,
    cvc: this.cvc,
    brand: brand,
    createdAt: new Date()
  };

  // Obtenemos el usuario actual desde AuthService
  const user = this.auth.getCurrentUser();
  if (!user) {
    console.error('No hay usuario autenticado');
    return;
  }

  this.cardService.saveCard(newCard, user.uid)
    .then(() => console.log('Tarjeta guardada exitosamente'))
    .catch(err => console.error('Error al guardar tarjeta:', err));

  if (!/^\d{2}\/\d{2}$/.test(this.expiryDate)) {
  console.log('Formato de fecha inválido');
  return;
}

const [monthStr, yearStr] = this.expiryDate.split('/');
const month = parseInt(monthStr, 10);
const year = parseInt(yearStr, 10);

if (month < 1 || month > 12 || year > 26) {
  console.log('Fecha de expiración inválida');
  return;
}
}


validateLuhn(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  const digits = cardNumber.replace(/\s+/g, '').split('').reverse();

  for (let digit of digits) {
    let num = parseInt(digit, 10);
    if (shouldDouble) {
      num *= 2;
      if (num > 9) num -= 9;
    }
    sum += num;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

detectBrand(cardNumber: string): string {
  const num = cardNumber.replace(/\s+/g, '');
  if (/^4/.test(num)) return 'Visa';
  if (/^5[1-5]/.test(num) || /^2(2[2-9][1-9]|[3-6][0-9]{2}|7[01][0-9]|720)/.test(num)) {
    return 'Mastercard';
  }
  return 'Unknown';
}


  // Formatea el número de tarjeta en bloques de 4
  formatCardNumber(num: string): string {
  return num.replace(/\D/g, '') // solo dígitos
            .slice(0,16)        // máximo 16
            .replace(/(\d{4})(?=\d)/g, '$1 ')
            .trim();
}

formatExpiryDate(value: string): string {
  return value.replace(/\D/g, '') // solo dígitos
              .slice(0,4)         // máximo 4
              .replace(/(\d{2})(?=\d)/, '$1/')
              .trim();
}

onCardNumberInput(event: any) {
  const value = event.target.value.replace(/\D/g, ''); // solo dígitos
  this.cardNumber = this.formatCardNumber(value.slice(0, 16)); // máximo 16
}

onNameInput(event: any) {
  const value = event.target.value;
  // Solo letras y espacios
  this.cardholderName = value.replace(/[^A-Za-z\s]/g, '');
}

onExpiryInput(event: any) {
  const value = event.target.value.replace(/\D/g, '').slice(0,4);
  this.expiryDate = value.replace(/(\d{2})(?=\d)/, '$1/');

  // Validación adicional
  const [monthStr, yearStr] = this.expiryDate.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (month < 1 || month > 12) {
    console.log('Mes inválido');
    this.expiryDate = '';
    return;
  }

  if (year > 26) { // porque es YY, 26 = 2026
    console.log('Año inválido, no puede ser posterior a 2026');
    this.expiryDate = '';
    return;
  }
}

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
