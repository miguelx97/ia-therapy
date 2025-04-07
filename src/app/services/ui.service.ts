import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    private loadingController: LoadingController,
    private alert: AlertController
  ) { }

  private loadingDialog?: HTMLIonLoadingElement;
  async showLoading(msg?: string) {
    this.loadingDialog = await this.loadingController.create({
      message: msg,
      duration: 10000
    });
    await this.loadingDialog.present();
  }

  hideLoading() {
    this.loadingDialog?.dismiss();
  }

  async confirm(header: string, message: string, confirmBtn: string = 'Accept', cancelBtn: string = 'Cancel'): Promise<boolean> {
    return new Promise(async resolve => {
      const alert = await this.alert.create({
        header, message,
        buttons: [
          {
            text: cancelBtn,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false);
            }
          }, {
            text: confirmBtn,
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });
  }
}
