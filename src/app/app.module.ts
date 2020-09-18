import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { PdfCropperComponent } from './pdf-cropper/pdf-cropper.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageCropperComponent,
    PdfCropperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
