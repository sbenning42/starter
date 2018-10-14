import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ZtoFacade, LoaderState } from '../../store/zto-store/zto-helpers';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../../components/dialogs/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private subscription: Subscription;
  private isLoading = false;
  private loadingDialogRef: MatDialogRef<LoadingComponent>;

  constructor(
    public ztoFacade: ZtoFacade,
    public dialog: MatDialog,
  ) {}

  private startLoader(content: string) {
    this.openDialog(content);
    this.isLoading = true;
  }

  private stopLoader() {
    this.closeDialog();
    this.isLoading = false;
  }

  startRun() {
    this.subscription = this.ztoFacade.loader$.subscribe((loaderState: LoaderState) => {
      if (loaderState.loading !== this.isLoading) {
        this.isLoading ? this.stopLoader() : this.startLoader(loaderState.content);
      }
    });
  }

  stopRun() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDialog(content: string): void {
    if (this.loadingDialogRef !== undefined) {
      return ;
    }
    this.loadingDialogRef = this.dialog.open(LoadingComponent, {
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
