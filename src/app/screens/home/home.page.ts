import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { send } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Message } from 'src/app/models/message';
import { Chatroom } from 'src/app/models/chatroom';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  constructor() {
    addIcons({ send });
  }

  public newMessage: string = '';

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

    this.newMessage = '';
  }

}
