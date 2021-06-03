import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseUserService } from '../services/firebase-user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  email: string;
  fname: string;
  lname: string;
  num: string;
  id: any;

  constructor(
     private firebaseService: FirebaseUserService,
     private router: Router,
    //  private route: ActivatedRoute
  ) {
    // this.route.params.subscribe((data: any) => {
    //   this.id = data.type;
    //   console.log('ID reached');
    //   this.firebaseService.get_single_transaction(data.type).subscribe((data: any) => {
    //     console.log(data);
    //     this.fname = data.fname;
    //   })
    // })
  }

  ngOnInit() {
  }

  addTransaction() {

    let data = {
      fname: this.fname,
      lname: this.lname,
      num: this.num,
    }
    this.firebaseService.add_transaction(data).then((res: any) => {
      console.log(res);
      this.router.navigateByUrl('/tabs/profile');
    });
  }

}
