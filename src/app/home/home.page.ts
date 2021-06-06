import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { FirebaseItemService } from '../services/firebase-item.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  itemList = [];
  public backupList: any[];

  constructor( private firebaseService: FirebaseItemService, private firestore: AngularFirestore ) { }

  ngOnInit() {
    this.firebaseService.get_transactions().subscribe(data => {

      this.itemList = data.map(e => ({
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Outlet: e.payload.doc.data()['Outlet'],
          Price: e.payload.doc.data()['Price'],
          User: e.payload.doc.data()['User']
      }));
      if(this.itemList.length === 0) {
        console.log('empty list');
      }
      console.log(this.itemList);
      console.log('reading works - Home page');

    }, (err: any) => {
      console.log(err);
    });

    // this.itemList = await this.initializeItems();
  }

  async initializeItems(): Promise<any> {
    const foodList = await this.firestore.collection('foodList')
      .valueChanges().pipe(first()).toPromise();
    this.backupList = foodList;
    return foodList;
  }

  async filterList(evt) {
    this.itemList = await this.initializeItems();
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.itemList = this.itemList.filter(currentFood => {
      if (currentFood.name && searchTerm) {
        // eslint-disable-next-line max-len
        return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || currentFood.type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

}
