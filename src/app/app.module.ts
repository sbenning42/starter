import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { RoutingModule } from './modules/routing/routing.module';
import { MaterialModule } from './modules/material/material.module';
import { ZtoStoreModule } from './store/zto-store/zto-store.module';
import { ErrorService } from './services/error/error.service';
import { LoaderService } from './services/loader/loader.service';
import { LoadingComponent } from './components/dialogs/loading/loading.component';
import { ErrorComponent } from './components/dialogs/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    ErrorComponent
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
