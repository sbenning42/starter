import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../../containers/dialogs/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingDialogRef: MatDialogRef<LoadingComponent>;

  constructor(
    public dialog: MatDialog,
  ) {}

  openDialog(content: string): void {
    if (this.loadingDialogRef !== undefined) {
      return ;
    }
    this.loadingDialogRef = this.dialog.open(LoadingComponent, {
      disableClose: true,
      width: '250px',
      data: {content}
    });

    this.loadingDialogRef.afterClosed().subscribe(result => {
    });
  }

  closeDialog() {
    if (this.loadingDialogRef === undefined) {
      return ;
    }
    this.loadingDialogRef.close();
    this.loadingDialogRef = undefined;
  }
}
