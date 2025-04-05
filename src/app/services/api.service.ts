import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Functions, getFunctions, httpsCallable } from '@angular/fire/functions';
import { initializeApp } from '@angular/fire/app';
import { functions } from '../common/firebase';

interface TherapistResponse {
  iaResponse: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  async getAiResponse(prompt: string): Promise<string> {
    const callable = httpsCallable<{ prompt: string }, TherapistResponse>(functions, 'talkWithTherapist');
    const result = await callable({ prompt });
    console.log("🚀 ~ ApiService ~ getAiResponse ~ result:", result);
    return result.data.iaResponse ?? '';
  }
}
