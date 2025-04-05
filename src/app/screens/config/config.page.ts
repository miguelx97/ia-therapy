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
import { ModalController } from '@ionic/angular/standalone';
import { AuthtService } from 'src/app/services/auth.service';
import { Chatroom } from 'src/app/models/chatroom';
import { User } from 'firebase/auth';
import { UserInfo } from 'src/app/models/userInfo';
import { UserService } from 'src/app/services/user.service';
import { Therapist } from 'src/app/models/therapisrt';

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
  userName: string = '';
  userContext: string = '';

  therapists: Therapist[] = [
  ];

  constructor(
    private authSvc: AuthtService,
    private modalCtrl: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadTherapists();
  }
  private async loadTherapists() {
    const response = await fetch('assets/therapists.json').then(res => res.json());
    this.therapists = response.therapists;
    console.log("🚀 ~ ConfigPage ~ loadTherapists ~ this.therapists:", this.therapists)
  }

  async onSubmit() {
    try {
      // Ensure user is authenticated anonymously
      const user: User = await this.authSvc.ensureAnonymousAuth();

      const chatRoom = new Chatroom(
        this.therapists[this.selectedTherapist - 1].id,
        'Your AI therapist',
        this.userContext
      );

      const userInfo = new UserInfo(
        user.uid,
        this.userName,
        user.email ?? '',
        [chatRoom]
      );

      // Save user info to Firestore
      await this.userService.saveUserInfo(userInfo);

      console.log('Configuration saved:', chatRoom);
      // Close the modal after successful submission
      this.modalCtrl.dismiss(chatRoom);

    } catch (error) {
      console.error('Error during configuration submission:', error);
      // Here you might want to show an error message to the user
    }
  }
}
