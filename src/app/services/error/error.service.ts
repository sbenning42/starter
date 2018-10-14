import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ZtoFacade, ErrorState, ErrorPayload } from '../../store/zto-store/zto-helpers';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../../components/dialogs/error/error.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private subscription: Subscription;
  private isLastErrorHandled: boolean;
  private errorDialogRef: MatDialogRef<ErrorComponent>;

  constructor(
    public ztoFacade: ZtoFacade,
    public dialog: MatDialog,
  ) {}

  private startError(error: ErrorPayload) {
    this.openDialog(error);
    this.isLastErrorHandled = false;
  }

  private stopError() {
    this.closeDialog();
    this.isLastErrorHandled = true;
  }

  startRun() {
    this.subscription = this.ztoFacade.error$.subscribe((errorState: ErrorState) => {
      if (errorState.errorHandled !== this.isLastErrorHandled) {
        (this.isLastErrorHandled !== false) ? this.startError(errorState.lastError) : this.stopError();
      }
    });
  }

  stopRun() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDialog(error: ErrorPayload): void {
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
