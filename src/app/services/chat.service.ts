import { inject, Injectable } from '@angular/core';
import { Functions, HttpsCallable, httpsCallable } from '@angular/fire/functions';
import { Firestore, doc, onSnapshot, DocumentData, collectionData, collection, query, limit, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, Subscription } from 'rxjs';
import { Chatroom } from '../models/chatroom';
import { Message } from '../models/message';
import { addDoc } from 'firebase/firestore';
import { UserService } from './user.service';
interface TherapistResponse {
  iaResponse: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private functions = inject(Functions);
  private firestore = inject(Firestore);
  private userService = inject(UserService);

  public chatRoom$: BehaviorSubject<Chatroom> = new BehaviorSubject(
    new Chatroom(
      1,
      'Your personal therapist',
      'Default user context',
      ''
    )
  );

  private chatRoomSubscription?: Subscription;

  private talkWithTherapist: HttpsCallable<{
    message: string;
    chatRoomId: string;
  }, TherapistResponse, unknown>;

  constructor() {
    this.talkWithTherapist = httpsCallable<{ message: string; chatRoomId: string }, TherapistResponse>(
      this.functions,
      'talkWithTherapist'
    );
  }

  async initChatRoom(): Promise<void> {
    const userInfo = await this.userService.getUserInfo();
    if (!userInfo) {
      throw new Error('User info not found');
    }
    const chatroomsCollection = collection(this.firestore, 'chatrooms');
    const firstChatroomQuery = query(chatroomsCollection, limit(1), where('therapistId', '==', userInfo.selectedChatRoom), where('userId', '==', userInfo.id));

    this.chatRoomSubscription = collectionData(firstChatroomQuery, { idField: 'id' }).subscribe(chatrooms => {
      const data = chatrooms[0];
      if (data) {
        const chatroom = new Chatroom(
          data['therapistId'],
          data['description'],
          data['userContext'],
          data['userId'],
          data['messages']?.map((message: Message) => new Message().messageFromFirestore(message)),
          data['id']
        );
        console.log("Obv Chatroom", chatroom);

        this.chatRoom$.next(chatroom);
      }
    });
  }

  async saveChatRoom(chatRoom: Chatroom): Promise<void> {
    const chatroomsCollection = collection(this.firestore, 'chatrooms');
    await addDoc(chatroomsCollection, chatRoom.getObject());
  }

  async sendMessage(message: string, chatRoomId: string): Promise<string> {
    const result = await this.talkWithTherapist({ message, chatRoomId });
    console.log("🚀 ~ ApiService ~ getAiResponse ~ result:", result);
    return result.data.iaResponse ?? '';
  }
}
