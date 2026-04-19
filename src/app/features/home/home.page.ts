import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';
import { CardService } from 'src/app/core/services/card.service';
import { EditCardModalComponent } from 'src/app/shared/components/edit-card/edit-card.component';
import { AddCardModalComponent } from 'src/app/shared/components/add-card/add-card.component';
import { UserService } from 'src/app/core/services/user';
import { take } from 'rxjs/internal/operators/take';
import { BiometricService } from 'src/app/core/services/biometric.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  isProfileModalOpen = false;

  // Exponemos directamente los observables
  userProfile$ = this.auth.userProfile$;
  cards$ = this.cardService.cards$;
  userPs$ = this.userService.getUserProfile$();

    editableProfile: any = {
    uid: 'USER_UID',
    firstName: '',
    lastName: '',
    biometrics: false,
    email: ''
  };
  userPassword: string = '';

  constructor(public auth: AuthService, public cardService: CardService,
     private modalCtrl: ModalController, private userService: UserService,
      private alertCtrl: AlertController, private biometricService: BiometricService ) {}

  openProfileModal() {
    this.isProfileModalOpen = true;

    this.userPs$.pipe(take(1)).subscribe(profile => {
      if (profile) {
        this.editableProfile = { ...profile };
      }
    });
    
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

    async openAddCardModal() {
    const modal = await this.modalCtrl.create({
      component: AddCardModalComponent
    });
    await modal.present();
  }

  
async updateCard(card: any) {
  const modal = await this.modalCtrl.create({
    component: EditCardModalComponent,
    componentProps: { card }
  });
  await modal.present();

  const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm' && data) {
    const uid = (await this.auth.getCurrentUser())?.uid;
    console.log('Data recibido del modal:', data);

    if (uid && data.id) {
      await this.cardService.updateCard(data.id, uid, data);
    }
  }
}




async deleteCard(card: any) {
  const alert = await this.alertCtrl.create({
    header: 'Confirmar eliminación',
    message: `¿Seguro que quieres eliminar la tarjeta terminada en ${card.cardNumber.slice(-4)}?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: async () => {
          const uid = this.auth.getCurrentUser()?.uid;
          if (uid) {
            await this.cardService.deleteCard(card.id, uid);
          }
        }
      }
    ]
  });

  await alert.present();
}

async saveProfile() {
  const uid = this.auth.getCurrentUser()?.uid;
  if (uid) {
    await this.userService.updateUserProfile(uid, this.editableProfile);
    this.closeProfileModal();
  }
}

async toggleBiometric() {
  if (this.editableProfile.biometrics) {
    const available = await this.biometricService.isAvailable();
    if (available) {
      const alert = await this.alertCtrl.create({
        header: 'Biometric Sign In',
        message: 'Introduce tu contraseña para habilitar huella/FaceID',
        inputs: [
          {
            name: 'password',
            type: 'password',
            placeholder: 'Password'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.editableProfile.biometrics = false; // revertir toggle
            }
          },
          {
            text: 'Confirmar',
            handler: async (data) => {
              const verified = await this.biometricService.verifyIdentity();
              if (verified) {
                await this.biometricService.enrollBiometric(
                  this.editableProfile.uid,
                  this.editableProfile.email,
                  data.password
                );
                console.log('Biometría activada');
              } else {
                this.editableProfile.biometrics = false;
                console.log('Verificación biométrica fallida');
              }
            }
          }
        ]
      });
      await alert.present();
    }
  } else {
    await this.biometricService.disableBiometric(this.editableProfile.uid);
    console.log('Biometría desactivada');
  }
}



}
