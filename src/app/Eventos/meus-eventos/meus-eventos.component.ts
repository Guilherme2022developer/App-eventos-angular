import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from '../modls_eventos/evento';

@Component({
  selector: 'app-meus-eventos',
  templateUrl: './meus-eventos.component.html',
  styleUrls: ['./meus-eventos.component.css']
})
export class MeusEventosComponent  implements OnInit {

  public eventos: Evento[];
  errorMessage: string;


  constructor(public eventoService: EventoService){}
  ngOnInit(){

    this.eventoService.obterMeusEventos().subscribe(
      evento => this.eventos = [evento], // Envolve o objeto evento em um array
      error => this.errorMessage = error
    );
  }
}
