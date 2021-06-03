import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { FirebaseUploadService } from 'src/app/services/firebase-upload.service';
// import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
// import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
})
export class PhotoUploadComponent implements OnInit {

  barStatus = false;
  uploadStatus = false;
  imageUploads = [];

  // croppedImagepath = "";
  // isLoading = false;

  // imagePickerOptions = {
  //   maximumImagesCount: 1,
  //   quality: 50
  // };

  constructor(
    private firebaseUploadService: FirebaseUploadService,
    public actionSheetCtrl: ActionSheetController,
    // private camera: Camera,
    // private file: File
  ) { }

  ngOnInit() { }

/////////////////////////////////////////////////////////////////
// source code for open camera and gallery in device
  // pickImage(sourceType) {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     sourceType: sourceType,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   };
  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     this.croppedImagepath = 'data:image/jpeg;base64,' + imageData;
  //   }, (err) => {
  //     // Handle error
  //   });
  // }

  // async selectImage() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Select Image source',
  //     buttons: [{
  //       text: 'Load from Library',
  //       handler: () => {
  //         this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
  //       }
  //     },
  //     {
  //       text: 'Use Camera',
  //       handler: () => {
  //         this.pickImage(this.camera.PictureSourceType.CAMERA);
  //       }
  //     },
  //     {
  //       text: 'Cancel',
  //       role: 'cancel'
  //     }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

/////////////////////////////////////////////////////////////////

  uploadPhoto(event) {

    this.barStatus = true;

    this.firebaseUploadService.storeImage(event.target.files[0]).then((res: any) => {
      if(res) {
        this.barStatus = false;
        this.imageUploads.unshift(res);
      }
    },
    (error: any) => {
      this.barStatus = false;
    }
    );

  }

  async showActionSheet(){
    const actionSheet = this.actionSheetCtrl.create({
        header: 'Upload the photo with',
        buttons: [
        {
          text: 'Camera Roll',
          icon: 'camera',
          handler: () => {
            console.log('Camera opens (NOT FIXED YET)');
          }
        },{
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.uploadStatus = true;
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
        ]
     });
     (await actionSheet).present();
   }

}



