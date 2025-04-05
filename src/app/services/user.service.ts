import { inject, Injectable } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { UserInfo } from '../models/userInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);

  /**
   * Saves or updates user information in Firestore
   * @param userInfo The user information to save
   * @returns Promise that resolves when the save is complete
   */
  async saveUserInfo(userInfo: UserInfo): Promise<void> {
    try {
      if (!userInfo.id) {
        throw new Error('User ID is required');
      }

      const userDocRef = doc(this.firestore, `users/${userInfo.id}`);
      await setDoc(userDocRef, {
        name: userInfo.name,
        email: userInfo.email,
        chatRooms: userInfo.chatRooms?.map(chatRoom => chatRoom.getObject()) || []
      }, { merge: true });
    } catch (error) {
      console.error('Error saving user info:', error);
      throw error;
    }
  }
}
