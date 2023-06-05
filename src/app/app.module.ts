import { NgModule } from '@angular/core';
import { BrowserModule,Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localesPt from '@angular/common/locales/pt'
registerLocaleData(localesPt);
import {MyDatePickerModule} from 'mydatepicker'

import {
  NgxSnotifireModule,
  SnotifireService,
  ToastDefaults,
} from "ngx-snotifire";

//shared componets

import { MenuLoginComponent } from './shared/menu-login/menu-login.component';

//componets
import { HomeComponent } from './home/home.component';

import { AppComponent } from './app.component';

//botstrap
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { rootRouterConfig } from './app.routes';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

//services
import { SeoService } from './services/seo.service';
import { InscricaoComponent } from './usuario/inscricao/inscricao.component';
import { OrganizadorService } from './services/organizador.sevice';
import { LoginComponent } from './usuario/login/login.component';


import { AcessoNegadoComponent } from './shared/acesso-negado/acesso-negado.component';
import { ErrorInterceptor } from './services/htpp.error.handler';

import { NaoEncontradoComponent } from './shared/nao-encontrado/nao-encontrado.component';
import { SharedModule } from './shared/shared.module/shared.module.module';



//import {CollapseModule} from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InscricaoComponent,
    LoginComponent,
    AcessoNegadoComponent,
    NaoEncontradoComponent,
  ],
  imports: [
    BrowserModule,
    NgxSnotifireModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    SharedModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot(),
    RouterModule.forRoot(rootRouterConfig,{useHash: false}),
  ],
  providers: [
  Title,
  SeoService,
  OrganizadorService,
  {
    provide : HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
  { provide: "snotifireConfig", useValue: ToastDefaults },
    SnotifireService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
