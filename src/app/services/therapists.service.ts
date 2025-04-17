import { inject, Injectable } from '@angular/core';
import { Therapist } from '../models/therapisrt';
import { Database, getDatabase, ref, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class TherapistsService {
  private database = inject(Database);
  private therapists: Therapist[] = [];

  async getTherapists(): Promise<Therapist[]> {
    if (this.therapists.length === 0) {
      const therapistsRef = ref(this.database, 'therapists');
      const snapshot = await get(therapistsRef);
      if (snapshot.exists()) {
        this.therapists = Object.values(snapshot.val());
      }
    }
    return this.therapists;
  }

  async getTherapist(id: number): Promise<Therapist | undefined> {
    const therapists: Therapist[] = await this.getTherapists();
    return therapists.find(t => t.id === id);
  }
}
