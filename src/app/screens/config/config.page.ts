import { Component, inject, OnInit } from '@angular/core';
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
import { ChatService } from 'src/app/services/chat.service';
import { AuthtService } from 'src/app/services/auth.service';
import { Chatroom } from 'src/app/models/chatroom';
import { User } from 'firebase/auth';
import { UserInfo } from 'src/app/models/userInfo';
import { UserService } from 'src/app/services/user.service';
import { Therapist } from 'src/app/models/therapisrt';
import { TherapistsService } from 'src/app/services/therapists.service';
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

  chatSvc = inject(ChatService);
  userSvc = inject(UserService);
  therapistSvc = inject(TherapistsService);
  constructor(
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    this.therapists = await this.therapistSvc.getTherapists();
  }

  async onSubmit() {
    try {

      const userInfo = new UserInfo(
        this.userName
      );

      // Save user info to Firestore
      const uid = await this.userSvc.saveUserInfo(userInfo);

      const chatRoom = new Chatroom(
        this.therapists[this.selectedTherapist - 1].id,
        'Your AI therapist',
        this.userContext,
        uid
      );
      await this.chatSvc.saveChatRoom(chatRoom);

      console.log('Configuration saved:', chatRoom);
      // Close the modal after successful submission
      this.modalCtrl.dismiss(chatRoom);

    } catch (error) {
      console.error('Error during configuration submission:', error);
      // Here you might want to show an error message to the user
    }
  }
}
