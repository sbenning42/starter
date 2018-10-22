import { ZtoSampleComponent } from '../../containers/zto-sample/zto-sample.component';
import { AppStateComponent } from 'src/app/containers/app/app.component';
import { StoreCreatorComponent } from 'src/app/components/store-creator/store-creator.component';
import { StorageFacadeComponent } from 'src/app/containers/storage-facade/storage-facade.component';
import { HomeComponent } from 'src/app/containers/home/home.component';

export const AppRoutes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'app',
    component: AppStateComponent,
  },
  {
    path: 'zto-sample',
    component: ZtoSampleComponent,
  },
  {
    path: 'store-creator',
    component: StoreCreatorComponent,
  },
  {
    path: 'storage-facade',
    component: StorageFacadeComponent,
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  }
];
