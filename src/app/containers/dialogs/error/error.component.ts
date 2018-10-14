import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorPayload, ZtoFacade } from '../../../store/zto-store/zto-helpers';
import { environment } from '../../../../environments/environment';
import { AppFacade } from '../../../store/zto-store/app/facade';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  environment = environment;

  constructor(
    public zto: ZtoFacade,
    public dialogRef: MatDialogRef<ErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {error: ErrorPayload}
  ) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.zto.stopError({});
  }

}
