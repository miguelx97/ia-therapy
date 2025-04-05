import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from '@angular/fire/functions';

interface TherapistResponse {
  iaResponse: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private functions: any;
  constructor() {
    this.initializeFirebase();
  }

  initializeFirebase(): void {
    const app = initializeApp(environment.firebase);
    this.functions = getFunctions(app, 'us-central1');
  }

  async getAiResponse(prompt: string): Promise<string> {
    const callable = httpsCallable<{ prompt: string }, TherapistResponse>(this.functions, 'talkWithTherapist');
    const result = await callable({ prompt });
    console.log("🚀 ~ ApiService ~ getAiResponse ~ result:", result);
    return result.data.iaResponse ?? '';
  }
}
