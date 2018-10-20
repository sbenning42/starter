import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../../containers/dialogs/error/error.component';
import { ZtoFacade } from 'src/app/store/zto-store/facade';
import { ZtoHeader, ZtoResolveError } from 'src/app/store/zto-store/models';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errorDialogRef: MatDialogRef<ErrorComponent>;
  private subsciption: Subscription;

  constructor(
    public dialog: MatDialog,
    private zto: ZtoFacade,
    private store: Store<any>
  ) {}

  run() {
    this.subsciption = this.zto.pendingErrors$.subscribe((errors: {[id: string]: ZtoHeader}) => {
      const length = Object.keys(errors).length;
      if (length > 0 && this.errorDialogRef === undefined) {
        this.openDialog(Object.values(errors)[0].errorContent, Object.values(errors)[0].errorId);
      } else if (length === 0 && this.errorDialogRef !== undefined) {
        this.closeDialog();
      }
    });
  }

  stop() {
    if (this.subsciption) {
      this.subsciption.unsubscribe();
    }
  }

  private openDialog(error: any, id: string): void {
    if (this.errorDialogRef !== undefined) {
      return ;
    }
    this.errorDialogRef = this.dialog.open(ErrorComponent, {
      width: '250px',
      data: {error}
    });
    this.errorDialogRef.afterClosed().subscribe(result => {
      this.store.dispatch(new ZtoResolveError('[ErrorService@openDialog.afterClosed] Resolve', {type: undefined, header: {errorId: id}}));
    });
  }

  private closeDialog() {
    if (this.errorDialogRef === undefined) {
      return ;
    }
    this.errorDialogRef.close();
    this.errorDialogRef = undefined;
  }
}
