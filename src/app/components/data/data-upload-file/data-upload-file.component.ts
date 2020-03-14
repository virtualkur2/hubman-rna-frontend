import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';
import { UtilsService } from '../../../services/utils.service';
import { BackendService } from '../../../services/backend.service';
import { Algorithm } from '../../../interfaces/algorithm';
import { DataResults } from 'src/app/interfaces/data.results';
import { ResultsDialog } from '../../dialogs/results.dialog';
import { MatDialog } from '@angular/material/dialog';

interface DataModel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-data-upload-file',
  templateUrl: './data-upload-file.component.html',
  styleUrls: ['./data-upload-file.component.css']
})
export class DataUploadFileComponent implements OnInit{

  algorithms: Algorithm[];
  trainFileUploadProgress: number = 0;
  testFileUploadProgress: number = 0;
  trainFileSizePercentage: number = 0;
  testFileSizePercentage: number = 0;
  trainFileSizeRatio: number = 0;
  testFileSizeRatio: number = 0;

  readonly maxSize = 20971520; //20MB => 20 * (2 ** 20)
  formValues: DataModel[];
  uploadForm: FormGroup;

  onDoneClicked = () => {
    let algorithmIndex = this.algorithms.findIndex(algorithm => algorithm.name === this.uploadForm.get('algorithmName').value);
    let trainFile = this.uploadForm.get('trainFile').value.files[0];
    let testFile = this.uploadForm.get('testFile').value.files[0];

    let totalFileSize = testFile.size + trainFile.size;
    this.trainFileSizePercentage = Math.round((trainFile.size * 100) / totalFileSize);
    this.testFileSizePercentage = Math.round((testFile.size * 100) / totalFileSize);
    this.trainFileSizeRatio = 100 / (this.trainFileSizePercentage ? this.trainFileSizePercentage : 1);
    this.testFileSizeRatio = 100 / (this.testFileSizePercentage ? this.testFileSizePercentage : 1);

    this.formValues = [
      { value: 'Conjunto de datos', viewValue: this.uploadForm.get('dataName').value },
      { value: 'Archivo de entrenamiento', viewValue: trainFile.name },
      { value: 'Archivo de prueba', viewValue: testFile.name },
      { value: 'Algoritmo', viewValue: this.algorithms[algorithmIndex].description }
    ]
  }

  onSubmit = () => {
    let formData = new FormData();
    formData.append('dataName', this.uploadForm.get('dataName').value);
    formData.append('trainFile', this.uploadForm.get('trainFile').value.files[0]);
    formData.append('testFile', this.uploadForm.get('testFile').value.files[0]);
    formData.append('algorithmName', this.uploadForm.get('algorithmName').value);

    this.backend.postFormData(formData)
    .pipe(
      this.utils.uploadProgress(percentDone => {
        if(percentDone < this.trainFileSizePercentage) {
          this.trainFileUploadProgress = Math.round(percentDone * this.trainFileSizeRatio);
        } else {
          this.trainFileUploadProgress = 100;
          this.testFileUploadProgress = Math.round((percentDone - this.trainFileSizePercentage) * this.testFileSizeRatio);
        }
      }),
      this.utils.toResponseBody()
    )
    .subscribe({
      next: (response: any) => {
        this.testFileUploadProgress = 100;
        this.openDialog(response);
      },
      error: (error: any) => {
        this.trainFileUploadProgress = 0;
        this.testFileUploadProgress = 0;
        console.error(error);
      },
      complete: () => {
        console.log('Complete');
      }
    });
  }

  // onBackendResponse(response: any): void {
  //   this.backend.getResults(response.taskstatusurl)
  //   .subscribe({
  //     next: (data: any) => {
  //       if(data.state === 'WORKING' || data.state === 'PENDING') {
  //         console.log(data.status ? data.status : 'Pending work...');
  //       } else {
  //         console.log(data.results ? data.results : 'No results after all.');
  //       }
  //     },
  //     error: (error: any) => {
  //       console.log(error);
  //     },
  //     complete: () => {
  //       console.log('Complete');
  //     }
  //   })
  // }

  constructor(private _formBuilder: FormBuilder,
              private utils: UtilsService,
              private backend: BackendService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.backend.getAlgorithms().subscribe({
      next: (response: any) => {
        this.algorithms = response.algorithms;
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log('Complete');
      }
    });
    this.uploadForm = this._formBuilder.group({
      dataName: ['', Validators.required],
      trainFile: [undefined, [Validators.required, FileValidator.maxContentSize(this.maxSize)]],
      testFile: [undefined, [Validators.required, FileValidator.maxContentSize(this.maxSize)]],
      algorithmName: ['', Validators.required]
    });
  }
  openDialog(backendResponse: any): void {
    const dialogRef = this.dialog.open(ResultsDialog, {
      width: '60%',
      data: backendResponse
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('Results dialog closed');
    });
  }
}
