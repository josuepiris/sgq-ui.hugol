import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import localePt from '@angular/common/locales/pt';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';

registerLocaleData(localePt, 'pt-BR');

export function tokenGetter() {
  return sessionStorage.getItem('token');
}

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    HttpClientModule,

    ToastModule,
    TieredMenuModule,
    ConfirmDialogModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.tokenWhitelistedDomains,
        disallowedRoutes: environment.tokenBlacklistedRoutes
      }
    })
  ],
  exports: [
    ToastModule,

    NavbarComponent
  ],
  providers: [
    Title,

    MessageService,
    DialogService,
    ConfirmationService,
    JwtHelperService
  ]
})
export class CoreModule { }
