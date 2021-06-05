import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FirebaseUserService } from '../services/firebase-user.service';

interface UserData {
  fname: string;
  lname: string;
  num: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profList: any;
  userData: UserData;

  constructor(
    private fbAuthService: AuthenticationService,
    public firebaseService: FirebaseUserService
  ) {
    this.userData = {} as UserData;
  }

  ngOnInit() {
    // this.firebaseService.get_transactions().subscribe((res) => {
    //   this.userDetails = res.map(e => ({
    //       id: e.payload.doc.id,
    //       email: e.payload.doc.data()['email'],
    //       fname: e.payload.doc.data()['fname'],
    //       lname: e.payload.doc.data()['lname'],
    //       num: e.payload.doc.data()['num'],
    //   }));
    //   console.log(this.userDetails);
    // }, (err: any) => {
    //   console.log(err);
    // });

    this.firebaseService.get_transactions().subscribe(data => {

      this.profList = data.map(e => ({
          id: e.payload.doc.id,
          isEdit: false,
          fname: e.payload.doc.data()['fname'],
          lname: e.payload.doc.data()['lname'],
          num: e.payload.doc.data()['num'],
      }));
      console.log(this.profList);
      console.log('reading works - prof page');

    }, (err: any) => {
      console.log(err);
    });
  }

  logoutAction() {
    console.log('logout');
    this.fbAuthService.SignOut();
    // ERROR => Check SignOut() - authentication.service.ts
    // when logout is clicked directs to login page,
    // BUT login details in there form
    // HOW to clear the form
  }

  editRecord(record) {
    record.isEdit = true;
    record.EditFname = record.fname;
    record.EditLname = record.lname;
    record.EditNum = record.num;
    console.log('Edit mode on');
  }

  updateRecord(recordRow) {
    let record = {};
    record['fname'] = recordRow.EditFname;
    record['lname'] = recordRow.EditLname;
    record['num'] = recordRow.EditNum;
    this.firebaseService.update_transaction(recordRow.id, record);
    recordRow.isEdit = false;
    console.log('Profile Updated');
  }

}
