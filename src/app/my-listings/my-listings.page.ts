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

  userList = [];

  constructor(
    private firebaseService: FirebaseItemService,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.firebaseService.get_transactions().subscribe(data => {

      this.userList = data.map(e => ({
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Outlet: e.payload.doc.data()['Outlet'],
          Price: e.payload.doc.data()['Price'],
      }));
      if(this.userList.length === 0) {
        console.log('empty list');
      }
      console.log(this.userList);
      console.log('reading works - page');

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
    this.firebaseService.update_transaction(recordRow.id, record);
    recordRow.isEdit = false;
    console.log('Item Updated');
  }

}
