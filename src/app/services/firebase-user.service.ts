import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserService {

  collectionName = 'user-details';

  constructor(
    private firestore: AngularFirestore
  ) { }

  get_transactions() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  add_transaction(data) {
    return this.firestore.collection(this.collectionName).add(data);
  }

  delete_transaction(id) {
    return this.firestore.doc(this.collectionName + '/' + id).delete();
  }

  get_single_transaction(id) {
    return this.firestore.collection(this.collectionName).doc(id).valueChanges();
  }
}

