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
  IonListHeader, IonImg, IonButtons, IonIcon, IonSpinner, IonProgressBar
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
import { UiService } from 'src/app/services/ui.service';

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
    IonSpinner,
    IonProgressBar
  ]
})
export class ConfigPage implements OnInit {
  @Input() canBeClosed: boolean = false;

  chatRoom: Chatroom = defaultChatroom();
  userInfo: UserInfo = createUserInfo(undefined, '');
  therapists: Therapist[] = [];
  progress: number | null = null;
  private progressInterval: any;

  chatSvc = inject(ChatService);
  therapistSvc = inject(TherapistsService);
  modalCtrl = inject(ModalController);
  uiSvc = inject(UiService);

  constructor() {
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

  private startProgressAnimation() {
    this.progress = 0;

    this.progressInterval = setInterval(() => {
      if (this.progress! < 1) {
        this.progress! += 0.01; // Will take 17 seconds to reach 1 (17 * 0.01)
      }
    }, 170);
  }

  private async stopProgressAnimation() {
    clearInterval(this.progressInterval);
    this.progress = 1;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.progress = null;
  }

  async onSubmit() {
    if (this.chatRoom.therapistId === -1) {
      this.chatRoom.therapistId = this.therapists[0].id;
    }
    try {
      this.startProgressAnimation();
      const success = await this.chatSvc.saveChatRoom(this.chatRoom);
      if (success) {
        console.log('Configuration saved:', this.chatRoom);
        await this.chatSvc.initChatRoom();
        // Close the modal after successful submission
        this.stopProgressAnimation();
        this.modalCtrl.dismiss(this.chatRoom);
      } else {
        console.error('Error during configuration submission');
        await this.uiSvc.showError('Error', 'Failed to save configuration. Please try again.');
      }
    } catch (error) {
      console.error('Error during configuration submission:', error);
      await this.uiSvc.showError('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      this.stopProgressAnimation();
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
