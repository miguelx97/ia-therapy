import { Component, inject, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { sendOutline, colorFilterOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Message } from 'src/app/models/message';
import { addMessage, Chatroom } from 'src/app/models/chatroom';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { MarkdownPipe } from 'src/app/pipes/markdown.pipe';
import { retry, Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular/standalone';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { ConfigPage } from '../config/config.page';
import { TherapistsService } from 'src/app/services/therapists.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, MarkdownPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private modalCtrl: ModalController) {
    addIcons({ sendOutline, colorFilterOutline });
  }

  chatSvc = inject(ChatService);
  therapistSvc = inject(TherapistsService);

  public chatRoom: Chatroom | undefined;
  public header: { title: string, description: string, image: string } = { title: 'IA Therapy', description: 'Your personal therapist', image: 'assets/avatar.jpg' };
  chatRoomSubscription = new Subscription();

  async ngOnInit(): Promise<void> {
    await this.chatSvc.initChatRoom();
    this.chatRoomSubscription = this.chatSvc.chatRoom$.subscribe(async (chatroom) => {
      this.chatRoom = chatroom;
      if (this.chatRoom.therapistId > 0) {
        this.header.title = (await this.therapistSvc.getTherapist(this.chatRoom.therapistId))?.name ?? '';
        this.header.description = this.chatRoom.description;
        this.header.image = `assets/therapists/therapist_${this.chatRoom.therapistId}.webp`;
      } else if (this.chatRoom.therapistId === -1) {
        this.openConfig(false);
      }
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.chatRoomSubscription.unsubscribe();
  }

  public newMessage: string = '';
  public isTyping: boolean = false;

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }, 100);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  async openImageViewer() {
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        imageSrc: 'assets/therapist.webp',
        imageAlt: 'Therapist avatar'
      }
    });
    await modal.present();
  }

  public async sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }
    const messageContent = this.newMessage;
    const message = new Message().createMessage(messageContent, 'user');
    this.chatRoom = addMessage(this.chatRoom!, message);
    this.isTyping = true;
    this.newMessage = '';
    this.scrollToBottom();

    const response = await this.chatSvc.sendMessage(messageContent, this.chatRoom!.id!);
    if (response) {
      this.scrollToBottom();
    }
    this.isTyping = false;
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  async openConfig(canBeClosed: boolean = true) {
    const modal = await this.modalCtrl.create({
      component: ConfigPage,
      backdropDismiss: false,
      componentProps: {
        canBeClosed: canBeClosed
      }
    });
    await modal.present();
  }

}
