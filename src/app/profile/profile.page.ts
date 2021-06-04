import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FirebaseUserService } from '../services/firebase-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userDetails: any;

  constructor(
    private fbAuthService: AuthenticationService,
    public firebaseService: FirebaseUserService
  ) { }

  ngOnInit() {
    this.firebaseService.get_transactions().subscribe((res) => {
      this.userDetails = res.map(e => ({
          id: e.payload.doc.id,
          email: e.payload.doc.data()['email'],
          fname: e.payload.doc.data()['fname'],
          lname: e.payload.doc.data()['lname'],
          num: e.payload.doc.data()['num'],
      }));
      console.log(this.userDetails);
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

}
