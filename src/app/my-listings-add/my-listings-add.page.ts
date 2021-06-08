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
    console.log(this.userForm.value['User']);
  }


  addRecord() {
    this.firebaseService.add_transaction(this.userForm.value)
      .then(resp => {
        this.userForm.reset();
        this.router.navigate(['/tabs/my-listings']);
        console.log('Item Added...');
      })
      .catch(error => {
        console.log(error);
      });
  }

}
