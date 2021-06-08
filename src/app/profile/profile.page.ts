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
  isPath: boolean;
  userData: UserData;
  fileUrl: any;
  uname: string;

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

  private basePath = '/uploads';

  constructor(
    private fbAuthService: AuthenticationService,
    public firebaseService: FirebaseUserService,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) {
    this.uid = localStorage.getItem('uid');
    this.isUser = false;
    this.isPath = false;
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

      // localStorage.setItem('user', this.uid);

      this.backupProfList = [];

      if(this.profList[this.profList.length - 1]['user'] === '') {
        this.profList[this.profList.length - 1]['user'] = this.uid;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for(let i = 0; i < this.profList.length; i++) {
        if(this.profList[i]['user'] === this.uid) {
          this.backupProfList.push(this.profList[i]);
        }
      }

      if(this.backupProfList.length === 0) {
        this.backupProfList.push(this.profList[0]);
        this.isUser = true;
      }

      console.log(this.backupProfList);

      localStorage.setItem('uname', JSON.stringify(this.backupProfList[0]['fname']));
      this.uname = localStorage.getItem('uname').replace(/"/g, " ");

      console.log(this.uname);

      // User Checking
      if(this.backupProfList[0]['user'] === this.uid) {
        this.isUser = true;
      }

      // Path Checking
      if(this.backupProfList[0]['filePath'] !== '') {
        this.isPath = true;
      } else {
        this.isPath = false;
      }

      localStorage.setItem('url', this.backupProfList[0]['filePath']);
      this.fileUrl = localStorage.getItem('url');

    }, (err: any) => {
      console.log(err);
    });
  }

  // deleteFileStorage(name: string) {
  //   const storageRef = this.storage.storage.ref();
  //   storageRef.child(`${this.basePath}/${name}`).delete();
  //   console.log('Old Deleted');
  // }

  async uploadFile(event: FileList) {
    console.log('Uploading...');

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

    // deleting task
    if(this.isPath) {
      const delFileName = this.backupProfList[0]['filePath'];
      const delRef = this.storage.refFromURL(delFileName);
      delRef.delete();
      console.log('Old Photo Deleted');
    }

    // The main task
    this.task = this.storage.upload(path, file);

    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.uploadedFileURL = fileRef.getDownloadURL().subscribe(res=>{
          let data = {
            id: this.backupProfList[0]['id'],
            EditFname: this.backupProfList[0]['fname'],
            EditLname: this.backupProfList[0]['lname'],
            EditNum: this.backupProfList[0]['num']
          };
          localStorage.setItem('url', res);
          this.fileUrl = localStorage.getItem('url');

          this.isUploading = false;
          this.isUploaded = true;
          this.isPath = true;

          // this.updateRecord(data);
          console.log('Photo Uploaded...');

        });

      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    );

    this.snapshot.subscribe(
      res => {
        // console.log('no error');
      }, err => {
        // console.log('error');
      }
    );
  }


  logoutAction() {
    console.log('Logging out');
    localStorage.removeItem('uname');
    this.fbAuthService.SignOut();
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
    // recordRow.isEdit = false;
    console.log('Profile Updated...');
  }

  addRecord(data) {
    this.firebaseService.add_transaction(data)
      .catch(error => {
        console.log(error);
      });
    console.log('Details Added...');
  }

}
