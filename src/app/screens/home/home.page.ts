import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { send } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Message } from 'src/app/models/message';
import { Chatroom } from 'src/app/models/chatroom';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MarkdownPipe } from 'src/app/pipes/markdown.pipe';
import { retry } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, MarkdownPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  constructor() {
    addIcons({ send });
  }

  apiSvc = inject(ApiService);

  ngOnInit(): void {
  }

  public newMessage: string = '';
  public isTyping: boolean = false;

  // sk-541381ddc5f0460bab1ee79367870d3f
  chatRoom: Chatroom = new Chatroom(
    'IA Therapy',
    'Your personal therapist',
    'You are a helpful assistant that can answer questions and help with tasks.'
  );

  public sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }
    const message = new Message(this.newMessage, 'user');
    this.chatRoom.addMessage(message);
    this.isTyping = true;
    this.apiSvc.getAiResponse(this.newMessage).then((response) => {
      const aiMessage = new Message(response, 'ai');
      this.chatRoom.addMessage(aiMessage);
      this.isTyping = false;
    });

    this.newMessage = '';
  }

}
