import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonList,
  IonRadioGroup,
  IonRadio,
  IonListHeader, IonImg
} from '@ionic/angular/standalone';
import { UserService } from '../../services/user.service';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [IonImg,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonList,
    IonRadioGroup,
    IonRadio,
    IonListHeader
  ]
})
export class ConfigPage implements OnInit {
  selectedTherapist: number = 1;
  userDescription: string = '';
  talkAbout: string = '';

  therapists = [
    { id: 1, image: 'assets/therapists/therapist_1.webp', name: 'Dr. Sarah Johnson' },
    { id: 2, image: 'assets/therapists/therapist_2.webp', name: 'Dr. Michael Chen' },
    { id: 3, image: 'assets/therapists/therapist_3.webp', name: 'Dr. Emily Williams' }
  ];

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      // Ensure user is authenticated anonymously
      const user = await this.userService.ensureAnonymousAuth();

      const configData = {
        selectedTherapist: this.selectedTherapist,
        userDescription: this.userDescription,
        talkAbout: this.talkAbout,
        userId: user.uid
      };

      console.log('Configuration saved:', configData);
      // Close the modal after successful submission
      this.modalCtrl.dismiss(configData);

    } catch (error) {
      console.error('Error during configuration submission:', error);
      // Here you might want to show an error message to the user
    }
  }
}
