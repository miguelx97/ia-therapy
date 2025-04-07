import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonLabel,
  IonTextarea,
  IonButton,
  IonList,
  IonRadioGroup,
  IonRadio,
  IonListHeader, IonImg, IonButtons, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ChatService } from 'src/app/services/chat.service';
import { Chatroom, defaultChatroom } from 'src/app/models/chatroom';
import { createUserInfo, UserInfo } from 'src/app/models/userInfo';
import { UserService } from 'src/app/services/user.service';
import { Therapist } from 'src/app/models/therapisrt';
import { TherapistsService } from 'src/app/services/therapists.service';
import { firstValueFrom } from 'rxjs';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons, IonImg,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    // IonInput,
    IonLabel,
    IonTextarea,
    IonButton,
    IonList,
    IonRadioGroup,
    IonRadio,
    IonListHeader,
    IonSpinner
  ]
})
export class ConfigPage implements OnInit {
  @Input() canBeClosed: boolean = false;

  chatRoom: Chatroom = defaultChatroom();
  userInfo: UserInfo = createUserInfo(undefined, '');
  therapists: Therapist[] = [];
  loading: boolean = false;

  chatSvc = inject(ChatService);
  therapistSvc = inject(TherapistsService);
  modalCtrl = inject(ModalController);
  constructor(
  ) {
    addIcons({ close });
  }

  async ngOnInit() {
    firstValueFrom(this.chatSvc.chatRoom$).then(chatRoom => {
      if (chatRoom) this.chatRoom = chatRoom;
    });
    this.therapistSvc.getTherapists().then(therapists => {
      if (therapists) this.therapists = therapists;
    });
  }

  async onSubmit() {
    if (this.chatRoom.therapistId === -1) {
      this.chatRoom.therapistId = this.therapists[0].id;
    }
    try {
      this.loading = true;
      const success = await this.chatSvc.saveChatRoom(this.chatRoom);
      if (success) {
        console.log('Configuration saved:', this.chatRoom);
        this.chatSvc.initChatRoom();
        // Close the modal after successful submission
        this.modalCtrl.dismiss(this.chatRoom);
      } else {
        console.error('Error during configuration submission');
      }

    } catch (error) {
      console.error('Error during configuration submission:', error);
      // Here you might want to show an error message to the user
    } finally {
      this.loading = false;
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }
}
