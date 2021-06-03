import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [PhotoUploadComponent],
  exports: [PhotoUploadComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
