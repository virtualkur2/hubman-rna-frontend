import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Component, OnInit } from '@angular/core';
import { DataResults } from 'src/app/interfaces/data.results';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-results-dialog',
  templateUrl: 'results.dialog.html',
  styleUrls: ['results.dialog.css']
})
export class ResultsDialog implements OnInit {
  dataSource: DataResults[] = [];
  status: string;
  loading: boolean = true;
  displayedColumns: string[] = ['dataset_id','accuracy', 'precision', 'recall', 'f1score'];
  constructor(
    private backend: BackendService,
    public dialogRef: MatDialogRef<ResultsDialog>,
    @Inject(MAT_DIALOG_DATA) public response: any
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.backend.getResults(this.response.taskstatusurl)
    .subscribe({
      next: (data: any) => {
        if(data.state === 'WORKING' || data.state === 'PENDING') {
          console.log(data.status ? data.status : 'Pending work...');
          this.status = data.status ? data.status : 'Pending work...';
        } else {
          console.log(data.results ? data.results : 'No results after all.');
          this.dataSource.push(data.results);
          this.loading = !this.loading;
        }
      },
      error: (error: any) => {
        console.log(error);
        this.status = 'Uuuupsss, something wrong happens.'
        this.loading = false;
      },
      complete: () => {
        console.log('Complete');
        this.loading = false;
      }
    })
  }
}
