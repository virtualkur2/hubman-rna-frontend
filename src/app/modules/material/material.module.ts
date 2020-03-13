import { NgModule } from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import { MaterialFileInputModule } from 'ngx-material-file-input';

@NgModule({
   exports: [
    A11yModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatStepperModule,
    MaterialFileInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ]
})
export class MaterialModule { }
