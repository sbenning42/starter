import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider
} from 'angular-6-social-login';

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('Your-Facebook-app-id')
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('Your-Google-Client-Id')
        },
        {
          id: LinkedinLoginProvider.PROVIDER_ID,
          provider: new LinkedinLoginProvider('Your-Linkedin-Client-Id')
        },
      ]
  );
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    SocialLoginModule
  ],
  declarations: [],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ]
})
export class SocialModule { }
