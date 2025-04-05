import { getFunctions } from "@angular/fire/functions";
import { initializeApp } from "firebase/app";
import { environment } from "src/environments/environment";

const app = initializeApp(environment.firebase);

export const functions = getFunctions(app, 'us-central1');