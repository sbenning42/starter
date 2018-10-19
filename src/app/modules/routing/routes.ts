import { ZtoSampleComponent } from '../../containers/zto-sample/zto-sample.component';

export const AppRoutes = [
  {
    path: 'zto-sample',
    component: ZtoSampleComponent,
  },
  {
    path: '**',
    redirectTo: '/zto-sample',
    pathMatch: 'full',
  }
];
