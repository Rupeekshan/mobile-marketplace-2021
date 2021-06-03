import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private fbAuthService: AuthenticationService) { }

  ngOnInit() {
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
