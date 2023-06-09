import { Routes } from "@angular/router";
import { AdicionarEventoComponent } from "./adicionar-evento/adicionar-evento.component";
import { DetalhesEventoComponent } from "./detalhes-evento/detalhes-evento.component";
import { EditarEventoComponent } from "./editar-evento/editar-evento.component";
import { EventoComponent } from "./evento.component";
import { ExcluirEventoComponent } from "./excluir-evento/excluir-evento.component";
import { ListaEventosComponent } from "./lista-eventos/lista-eventos.component";
import { MeusEventosComponent } from "./meus-eventos/meus-eventos.component";
import { AuthService } from "./services/auth.service";

export const eventosRouterConfig: Routes = [
    {
        path: '', component: EventoComponent,
        children: [
            { path: '', component: ListaEventosComponent },
            { path: 'lista-eventos', component: ListaEventosComponent },
            { path: 'novo', canActivate: [AuthService], component: AdicionarEventoComponent, data: [{ claim: { nome: 'Eventos', valor: 'Gravar' } }] },
            { path: 'meus-eventos', canActivate: [AuthService], component: MeusEventosComponent },
            { path: 'editar/:id', canActivate: [AuthService], component: EditarEventoComponent, data: [{ claim: { nome: 'Eventos', valor: 'Gravar' } }] },
            { path: 'detalhes/:id', component: DetalhesEventoComponent },
            { path: 'excluir/:id', canActivate: [AuthService], component: ExcluirEventoComponent, data: [{ claim: { nome: 'Eventos', valor: 'Gravar' } }] }
        ]
    }
];