/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseItemService } from '../services/firebase-item.service';

interface UserItemData {
  Name: string;
  Outlet: string;
  Price: number;
  User: any;
}

@Component({
  selector: 'app-my-listings-add',
  templateUrl: './my-listings-add.page.html',
  styleUrls: ['./my-listings-add.page.scss'],
})

export class MyListingsAddPage implements OnInit {

  userList = [];
  userItemData: UserItemData;
  userForm: FormGroup;

  constructor(
    private firebaseService: FirebaseItemService,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.userItemData = {} as UserItemData;
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      Name: ['', [Validators.required]],
      Outlet: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      User: localStorage.getItem('uid')
    });

    // this.firebaseService.get_transactions().subscribe(data => {

    //   this.userList = data.map(e => ({
    //       id: e.payload.doc.id,
    //       isEdit: false,
    //       Name: e.payload.doc.data()['Name'],
    //       Outlet: e.payload.doc.data()['Outlet'],
    //       Price: e.payload.doc.data()['Price'],
    //     }));
    //   console.log(this.userList);
    //   console.log('reading works - add-page');

    // }, (err: any) => {
    //   console.log(err);
    // });
  }


  addRecord() {
    console.log('adding works');
    console.log(this.userForm);
    this.firebaseService.add_transaction(this.userForm.value)
      .then(resp => {
        this.userForm.reset();
        this.router.navigate(['/tabs/my-listings']);
      })
      .catch(error => {
        console.log(error);
      });
  }

}
