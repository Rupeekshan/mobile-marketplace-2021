import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';




@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  location = 'uploads/';

  constructor(private angularFireStorage: AngularFireStorage) { }

  imageName() {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }

  async storeImage(imageData: any) {
    try {
      const imageName = this.imageName();
      return new Promise((resolve, reject) => {

        const pictureRef = this.angularFireStorage.ref(this.location + imageName)

      });

    } catch(e) {

    }
  }
}
