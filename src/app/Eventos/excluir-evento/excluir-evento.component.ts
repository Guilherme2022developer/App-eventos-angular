import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from "@angular/core";
import { FormControlName } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SnotifireService } from "ngx-snotifire";
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
 

  constructor(private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router, private snotifireService: SnotifireService) {


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
      result => {this.onDeleteComplete(result)},
      fail => {this.onError(fail)}
    );

  }

  public onDeleteComplete(evento: any) {
    let toasterMessage =  this.snotifireService.success('Evento Apagado com Sucesso!', 'Obaa deu certo..', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

    if(toasterMessage){
      toasterMessage.eventEmitter.subscribe(()=>{
        this.router.navigate(['/eventos/meus-eventos']);
      });
    }
  }

  public onError(fail: any) {
    this.snotifireService.error('Ocorreu um erro!', 'OPS!', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

  }
}
