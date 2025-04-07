import { inject, Injectable } from '@angular/core';
import { Functions, HttpsCallable, httpsCallable } from '@angular/fire/functions';
import { Firestore, doc, onSnapshot, DocumentData, collectionData, collection, query, limit, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, Subscription } from 'rxjs';
import { Chatroom, createChatroom, defaultChatroom } from '../models/chatroom';
import { Message } from '../models/message';
import { addDoc, setDoc, Unsubscribe } from 'firebase/firestore';
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
    createChatroom(
      0,
      '',
      'Your personal therapist',
      ''
    )
  );

  private chatRoomSubscription?: Unsubscribe;

  private talkWithTherapist: HttpsCallable<{
    message: string;
    chatRoomId: string;
  }, TherapistResponse, unknown>;

  private createUpdateChatRoom: HttpsCallable<{ chatroom: Chatroom }, { success: boolean }>;
  private therapySummary: HttpsCallable<{ chatRoomId: string }, { success: boolean }>;

  constructor() {
    this.talkWithTherapist = httpsCallable<{ message: string; chatRoomId: string }, TherapistResponse>(
      this.functions,
      'talkWithTherapist'
    );
    this.createUpdateChatRoom = httpsCallable<{ chatroom: Chatroom }, { success: boolean }>(
      this.functions,
      'createUpdateChatRoom'
    );
    this.therapySummary = httpsCallable<{ chatRoomId: string }, { success: boolean }>(
      this.functions,
      'therapySummary'
    );
  }

  async initChatRoom(): Promise<void> {
    try {
      const userInfo = await this.userService.getUserInfo();
      if (!userInfo.chatrooms) {
        this.chatRoom$.next(defaultChatroom());
        return;
      }
      const chatroomsDoc = doc(this.firestore, `chatrooms/${userInfo.selectedChatRoom}`);

      this.chatRoomSubscription = onSnapshot(chatroomsDoc, (doc) => {
        if (doc.exists()) {
          const chatroom = doc.data() as Chatroom;
          chatroom.id = doc.id;
          chatroom.messages = chatroom.messages.map(message => new Message().messageFromFirestore(message));
          this.chatRoom$.next(chatroom);
        } else {
          this.chatRoom$.next(defaultChatroom());
        }
      }, (error) => {
        console.error('Error listening to chatroom changes:', error);
        this.chatRoom$.next(defaultChatroom());
      });
    } catch (error) {
      console.error('Error initializing chat room:', error);
      this.chatRoom$.next(defaultChatroom());
      throw error;
    }
  }

  async saveChatRoom(chatRoom: Chatroom): Promise<boolean> {
    const chatRoomObject = Object.assign({}, chatRoom);
    const result = await this.createUpdateChatRoom({ chatroom: chatRoomObject });
    console.log("🚀 ~ ChatService ~ saveChatRoom ~ result:", result);
    return result.data.success;
  }

  async sendMessage(message: string, chatRoomId: string): Promise<string> {
    const result = await this.talkWithTherapist({ message, chatRoomId });
    console.log("🚀 ~ ApiService ~ getAiResponse ~ result:", result);
    return result.data.iaResponse ?? '';
  }

  async newSession(chatRoomId: string): Promise<void> {
    await this.therapySummary({ chatRoomId });
  }
}
