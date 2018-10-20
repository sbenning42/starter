import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { RoutingModule } from './modules/routing/routing.module';
import { MaterialModule } from './modules/material/material.module';
import { ZtoStoreModule } from './store/zto-store.module';

import { ErrorService } from './services/error/error.service';
import { LoaderService } from './services/loader/loader.service';

import { LoadingComponent } from './containers/dialogs/loading/loading.component';
import { ErrorComponent } from './containers/dialogs/error/error.component';

import { GreatingComponent } from './components/greating/greating.component';
import { ZtoSampleComponent } from './containers/zto-sample/zto-sample.component';
import { AppStateComponent } from './containers/app/app.component';
import { StoreCreatorComponent } from './components/store-creator/store-creator.component';
import { ActionCreatorComponent } from './components/action-creator/action-creator.component';
import { StorageFacadeComponent } from './containers/storage-facade/storage-facade.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    ErrorComponent,
    GreatingComponent,
    ZtoSampleComponent,
    AppStateComponent,
    StoreCreatorComponent,
    ActionCreatorComponent,
    StorageFacadeComponent,
  ],
  entryComponents: [
    LoadingComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    MaterialModule,
    ZtoStoreModule,
  ],
  providers: [
    ErrorService,
    LoaderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
