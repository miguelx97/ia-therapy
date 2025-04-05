import { inject, Injectable } from '@angular/core';
import { Functions, HttpsCallable, httpsCallable } from '@angular/fire/functions';

interface TherapistResponse {
  iaResponse: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private functions = inject(Functions);
  private talkWithTherapist: HttpsCallable<{
    prompt: string;
  }, TherapistResponse, unknown>;

  constructor() {
    this.talkWithTherapist = httpsCallable<{ prompt: string }, TherapistResponse>(
      this.functions,
      'talkWithTherapist'
    );
  }

  async getAiResponse(prompt: string): Promise<string> {
    const result = await this.talkWithTherapist({ prompt });
    console.log("🚀 ~ ApiService ~ getAiResponse ~ result:", result);
    return result.data.iaResponse ?? '';
  }
}
