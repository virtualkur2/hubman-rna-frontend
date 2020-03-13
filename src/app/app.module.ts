import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { DataComponent } from './components/data/data.component';
import { DataListComponent } from './components/data/data-list/data-list.component';
import { DataDetailComponent } from './components/data/data-detail/data-detail.component';
import { DataUploadComponent } from './components/data/data-upload/data-upload.component';
import { DataUploadFileComponent } from './components/data/data-upload-file/data-upload-file.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { MaterialModule } from './modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ResultsDialog } from './components/dialogs/results.dialog';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DataComponent,
    DataListComponent,
    DataDetailComponent,
    DataUploadComponent,
    DataUploadFileComponent,
    ProgressBarComponent,
    ResultsDialog
  ],
  entryComponents: [
    ResultsDialog
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
