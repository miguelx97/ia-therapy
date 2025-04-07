import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { createUserInfo, UserInfo } from '../models/userInfo';
import { AuthtService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore = inject(Firestore);
  private authSvc = inject(AuthtService);

  /**
   * Saves or updates user information in Firestore
   * @param userInfo The user information to save
   * @returns Promise that resolves when the save is complete
   */
  async saveUserInfo(userInfo: UserInfo): Promise<string> {
    try {
      if (!userInfo.id) {
        const { uid } = await this.authSvc.ensureAnonymousAuth();
        userInfo.id = uid;
      }

      const userDocRef = doc(this.firestore, `users/${userInfo.id}`);
      await setDoc(userDocRef, userInfo, { merge: true });
      return userInfo.id;
    } catch (error) {
      console.error('Error saving user info:', error);
      throw error;
    }
  }

  async getUserInfo(userId?: string): Promise<UserInfo> {
    if (!userId) {
      const { uid } = await this.authSvc.ensureAnonymousAuth();
      userId = uid;
    }
    const userDocRef = doc(this.firestore, `users/${userId}`);
    const userDoc = await getDoc(userDocRef);
    let userInfo = userDoc.data() as UserInfo;
    if (userInfo) userInfo.id = userId;
    else userInfo = createUserInfo(userId);
    console.log("🚀 ~ UserService ~ getUserInfo ~ userInfo:", userInfo)

    return userInfo;
  }
}
