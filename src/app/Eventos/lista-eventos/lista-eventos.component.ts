import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';
import { SeoModel, SeoService } from 'src/app/services/seo.service';
import { Evento } from '../modls_eventos/evento';


@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.css']
})
export class ListaEventosComponent implements OnInit {

  public eventos: Evento[];
  errorMessage: string;


  constructor(seoService: SeoService, private eventoService: EventoService){
   
    let seoModel: SeoModel = <SeoModel>{
      title: 'Próximos Eventos',
      description: "Lista dos próximos eventos técnicos no brasil",
      robots: 'Index,Follow',
      keywords: 'eventos,workshops,encontros,congressos'
    };
  seoService.setSeoDate(seoModel);
  }

  ngOnInit(){

    this.eventoService.obterTodos().subscribe(eventos => this.eventos = eventos,
      error => this.errorMessage = error)
  }
}
