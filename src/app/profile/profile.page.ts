import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FirebaseUserService } from '../services/firebase-user.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

export interface UserData {
  fname: string;
  lname: string;
  num: number;
  user: any;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profList: any;
  uid: string;
  isUser: boolean;
  userData: UserData;

  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  uploadedFileURL: any;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details
  fileName: string;
  fileSize: number;

  //Status check
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;

  constructor(
    private fbAuthService: AuthenticationService,
    public firebaseService: FirebaseUserService,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) {
    this.uid = localStorage.getItem('uid');
    this.isUser = false;
    this.userData = {} as UserData;

    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('freakyImages');
    this.images = this.imageCollection.valueChanges();
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
          user: e.payload.doc.data()['user']
      }));
      console.log(this.profList);
      console.log('reading works - prof page');

      // User Checking
      if(this.profList[0]['user'] === this.uid) {
        console.log('User Check');
        this.isUser = true;
      }


    }, (err: any) => {
      console.log(err);
    });
  }



  uploadFile(event: FileList) {
    console.log('Upload method entering');

    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
     console.error('unsupported file type :( )');
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();

    console.log('snap before');

    this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.uploadedFileURL = fileRef.getDownloadURL().subscribe(res=>{
          console.log('Method ENTER');
          this.addImagetoDB({
            name: file.name,
            filepath: res,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error=>{
          console.error(error);
        });
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    );
    console.log('snapshot: ', this.snapshot);
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
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
    record['user'] = localStorage.getItem('uid');
    this.firebaseService.update_transaction(recordRow.id, record);
    recordRow.isEdit = false;
    console.log('Profile Updated');
  }

  addRecord(data) {
    console.log('adding works');
    this.firebaseService.add_transaction(data)
      .catch(error => {
        console.log(error);
      });
  }

}
