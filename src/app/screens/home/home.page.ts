import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { sendOutline, colorFilterOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Message } from 'src/app/models/message';
import { Chatroom } from 'src/app/models/chatroom';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { MarkdownPipe } from 'src/app/pipes/markdown.pipe';
import { retry } from 'rxjs';
import { ModalController } from '@ionic/angular/standalone';
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';
import { ConfigPage } from '../config/config.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, MarkdownPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  constructor(private modalCtrl: ModalController) {
    addIcons({ sendOutline, colorFilterOutline });
  }

  apiSvc = inject(ChatService);

  public chatRoom: Chatroom | undefined;
  public header: { title: string, description: string } = { title: 'IA Therapy', description: 'Your personal therapist' };

  ngOnInit(): void {
    this.chatRoom = new Chatroom(
      1,
      'IA Therapy',
      'Default user',
    );
  }

  public newMessage: string = '';
  public isTyping: boolean = false;


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

  public sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }
    const message = new Message(this.newMessage, 'user');
    this.chatRoom!.addMessage(message);
    this.isTyping = true;
    this.apiSvc.getAiResponse(this.newMessage).then((response) => {
      const aiMessage = new Message(response, 'ai');
      this.chatRoom!.addMessage(aiMessage);
      this.isTyping = false;
    });

    this.newMessage = '';
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  async openConfig() {
    const modal = await this.modalCtrl.create({
      component: ConfigPage
    });
    await modal.present();
  }

}
