import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../../containers/dialogs/loading/loading.component';
import { ZtoFacade } from 'src/app/store/zto-store/facade';
import { ZtoHeader } from 'src/app/store/zto-store/models';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private subsciption: Subscription;
  private loadingDialogRef: MatDialogRef<LoadingComponent>;

  constructor(
    public dialog: MatDialog,
    private zto: ZtoFacade,
  ) {}

  run() {
    this.subsciption = this.zto.pendingLoadings$.subscribe((loadings: {[id: string]: ZtoHeader}) => {
      const length = Object.keys(loadings).length;
      if (length > 0 && this.loadingDialogRef === undefined) {
        this.openDialog(Object.values(loadings)[0].loadingContent);
      } else if (length === 0 && this.loadingDialogRef !== undefined) {
        this.closeDialog();
      }
    });
  }

  stop() {
    if (this.subsciption) {
      this.subsciption.unsubscribe();
    }
  }

  private openDialog(content: string): void {
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

  private closeDialog() {
    if (this.loadingDialogRef === undefined) {
      return ;
    }
    this.loadingDialogRef.close();
    this.loadingDialogRef = undefined;
  }
}
