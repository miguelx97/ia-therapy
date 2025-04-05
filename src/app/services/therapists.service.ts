import { inject, Injectable } from '@angular/core';
import { Therapist } from '../models/therapisrt';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TherapistsService {

  private http = inject(HttpClient);
  constructor() { }

  private therapists: Therapist[] = [];

  async getTherapists(): Promise<Therapist[]> {
    if (this.therapists.length === 0) {
      const response = await lastValueFrom(this.http.get<{ therapists: Therapist[] }>('assets/therapists.json'));
      this.therapists = response.therapists;
    }
    return this.therapists;
  }

  async getTherapist(id: number): Promise<Therapist | undefined> {
    const therapists: Therapist[] = await this.getTherapists();
    return therapists.find(t => t.id === id);
  }
}
