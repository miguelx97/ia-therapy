import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageViewerComponent {
    @Input() imageSrc!: string;
    @Input() imageAlt!: string;

    constructor(private modalCtrl: ModalController) {
        addIcons({ close });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
} 