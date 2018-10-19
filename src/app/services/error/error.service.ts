import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../../containers/dialogs/error/error.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errorDialogRef: MatDialogRef<ErrorComponent>;

  constructor(
    public dialog: MatDialog,
  ) {}

  openDialog(error: any): void {
    if (this.errorDialogRef !== undefined) {
      return ;
    }
    this.errorDialogRef = this.dialog.open(ErrorComponent, {
      width: '250px',
      data: {error}
    });
    this.errorDialogRef.afterClosed().subscribe(result => {
    });
  }

  closeDialog() {
    if (this.errorDialogRef === undefined) {
      return ;
    }
    this.errorDialogRef.close();
    this.errorDialogRef = undefined;
  }
}
