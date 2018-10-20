import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  environment = environment;
  name = '';
  message = '';

  constructor(
    public dialogRef: MatDialogRef<ErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {error: string}
  ) {
  }

  ngOnInit() {
    [this.name, this.message] = this.data.error.split('%');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
