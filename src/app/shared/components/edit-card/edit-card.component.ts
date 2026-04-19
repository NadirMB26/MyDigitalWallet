import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-card-modal',
  templateUrl: './edit-card-modal.component.html',
  styleUrls: ['./edit-card-modal.component.scss'],
  standalone: false,
})
export class EditCardModalComponent {
  @Input() card: any;

  constructor(private modalCtrl: ModalController) {}

save() {
  this.modalCtrl.dismiss({
    id: this.card.id,
    cardNumber: this.card.cardNumber ?? '',
    brand: this.card.brand ?? '',
     expiryDate: this.card.expiryDate ?? '',
     cardholderName: this.card.cardholderName ?? ''
  }, 'confirm');
  console.log('Card dentro del modal:', this.card);

}



  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  detectBrand(cardNumber: string): string {
  const num = (cardNumber || '').replace(/\s+/g, '');
  if (/^4/.test(num)) return 'Visa';
  if (/^5[1-5]/.test(num) || /^2/.test(num)) return 'Mastercard';
  return 'Unknown';
}

formatCardNumber(cardNumber: string): string {
  if (!cardNumber) return '';
  return cardNumber.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
}

}

