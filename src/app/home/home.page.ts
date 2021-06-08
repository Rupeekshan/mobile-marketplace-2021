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

  term: string;
  itemList = [];

  constructor( private firebaseService: FirebaseItemService ) { }

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
      // console.log('reading works - Home page');

    }, (err: any) => {
      console.log(err);
    });
  }

}
