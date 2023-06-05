import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from "@angular/core";
import { FormControlName } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Evento } from "../modls_eventos/evento";
import { EventoService } from "../services/evento.service";


@Component({
  selector: 'app-excluir-evento',
  templateUrl: './excluir-evento.component.html'
})
export class ExcluirEventoComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public sub: Subscription;
  public eventoId: string = "";
  public evento: Evento;
  snotifireService: any;

  constructor(private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router,

    vcr: ViewContainerRef) {


    this.evento = new Evento();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.eventoId = params['id'];
      });

    this.eventoService.obterMeuEvento(this.eventoId)
      .subscribe(
      evento => { this.evento = evento; },
      );
  }

  public excluirEvento() {
    this.eventoService.ExcluirEvento(this.eventoId).subscribe(
      result => {this.onDeleteComplete},
      fail => {this.onError()}
    );

  }

  public onDeleteComplete(evento: any) {
    let toasterMessage =  this.snotifireService.success('Apagado  com Sucesso!', 'Bem vindo', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

    if(toasterMessage){
      toasterMessage.eventEmitter.subscribe(()=>{
        this.router.navigate(['/lista-eventos']);
      });
    }
  }

  public onError() {
    this.snotifireService.error('Ocorreu um erro!', 'OPS!', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

  }
}
