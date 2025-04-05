import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from '@angular/fire/functions';


const app = initializeApp(environment.firebase);
const functions = getFunctions(app, 'us-central1');

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  initializeFirebase(): void {
  }

  getHelloWorld(): Promise<any> {
    const callable = httpsCallable(functions, 'helloWorld');
    return callable().then((result) => {
      console.log(result.data);
      return result.data;
    });
  }
}
