/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseItemService } from '../services/firebase-item.service';


@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage implements OnInit {

  itemList = [];
  backupItemList = [];
  uid: string;
  isUser: boolean;

  constructor(
    private firebaseService: FirebaseItemService,
    public fb: FormBuilder,
  ) {
    this.uid = localStorage.getItem('uid');
    this.isUser = false;
   }

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

      this.backupItemList = [];

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for(let i = 0; i < this.itemList.length; i++) {
        if(this.itemList[i]['User'] === this.uid) {
          this.backupItemList.push(this.itemList[i]);
        }
      }

      if(this.backupItemList.length === 0) {
        console.log('empty listing');
      }

      console.log(this.backupItemList);

      // console.log(this.itemList);
      // console.log(localStorage.getItem('uid'));
      console.log('reading works - listing page');

    }, (err: any) => {
      console.log(err);
    });
  }


  removeRecord(rowID) {
    this.firebaseService.delete_transaction(rowID);
    console.log('Item Deleted');
  }

  editRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditOutlet = record.Outlet;
    record.EditPrice = record.Price;
  }

  updateRecord(recordRow) {
    const record = {};
    record['Name'] = recordRow.EditName;
    record['Outlet'] = recordRow.EditOutlet;
    record['Price'] = recordRow.EditPrice;
    record['User'] = localStorage.getItem('uid');
    this.firebaseService.update_transaction(recordRow.id, record);
    recordRow.isEdit = false;
    console.log('Item Updated');
  }

}
