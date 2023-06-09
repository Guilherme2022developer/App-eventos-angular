import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AcessoNegadoComponent } from './shared/acesso-negado/acesso-negado.component';
import { InscricaoComponent } from "./usuario/inscricao/inscricao.component";
import { LoginComponent } from './usuario/login/login.component';
import { NaoEncontradoComponent } from './shared/nao-encontrado/nao-encontrado.component';

export const rootRouterConfig: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'inscricao', component: InscricaoComponent },
    { path: 'entrar', component: LoginComponent },
    { path: 'acesso-negado', component: AcessoNegadoComponent },
    { path: 'nao-encontrado', component: NaoEncontradoComponent },
    { path: 'eventos', loadChildren: () => import('./Eventos/evento.module').then(m => m.EventosModule) },
];
