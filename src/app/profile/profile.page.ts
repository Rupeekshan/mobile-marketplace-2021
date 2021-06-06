import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FirebaseUserService } from '../services/firebase-user.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


export interface UserData {
  fname: string;
  lname: string;
  num: number;
  filePath: string;
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
  backupProfList = [];
  isUser: boolean;
  userData: UserData;
  fileUrl: any;

  // Upload Task
  task: AngularFireUploadTask;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  uploadedFileURL: any;

  //File details
  fileName: string;
  fileSize: number;

  //Status check
  isUploading: boolean;
  isUploaded: boolean;

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
  }

  ngOnInit() {

    this.firebaseService.get_transactions().subscribe(data => {

      this.profList = data.map(e => ({
          id: e.payload.doc.id,
          isEdit: false,
          fname: e.payload.doc.data()['fname'],
          lname: e.payload.doc.data()['lname'],
          num: e.payload.doc.data()['num'],
          filePath: e.payload.doc.data()['filePath'],
          user: e.payload.doc.data()['user']
      }));

      console.log(this.profList);

      // User Checking
      if(this.profList[0]['user'] === this.uid) {
        this.isUser = true;
      }

      this.backupProfList = [];

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for(let i = 0; i < this.profList.length; i++) {
        if(this.profList[i]['user'] === this.uid) {
          this.backupProfList.push(this.profList[i]);
        }
      }

      localStorage.setItem('url', this.backupProfList[0]['filePath']);
      this.fileUrl = localStorage.getItem('url');

    }, (err: any) => {
      console.log(err);
    });
  }


  async uploadFile(event: FileList) {
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
    const path = `uploads/${new Date().getTime()}_${file.name}`;

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.uploadedFileURL = fileRef.getDownloadURL().subscribe(res=>{
          let data = {
            id: this.backupProfList['id'],
            EditFname: this.backupProfList['fname'],
            EditLname: this.backupProfList['lname'],
            EditNum: this.backupProfList['num']
          };
          localStorage.setItem('url', res);
          this.fileUrl = localStorage.getItem('url');

          this.isUploading = false;
          this.isUploaded = true;
          this.updateRecord(data);

        });

      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    );

    this.snapshot.subscribe(
      res => {
        console.log('no error');
      }, err => {
        console.log('error');
      }
    );
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
    // record.EditPath = record.filePath;
    console.log('Edit mode on');
  }

  updateRecord(recordRow) {
    let record = {};
    record['fname'] = recordRow.EditFname;
    record['lname'] = recordRow.EditLname;
    record['num'] = recordRow.EditNum;
    record['filePath'] = this.fileUrl;
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
