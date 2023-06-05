import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifireService } from 'ngx-snotifire';
import { fromEvent, merge, Observable } from 'rxjs';
import { EventoService } from 'src/app/services/evento.service';
import { GenericValidator } from 'src/app/utils/generic.form.validator';
import { Categoria, Endereco, Evento } from '../modls_eventos/evento';
import { DateUtils } from 'src/app/utils/data-type-utils';


@Component({
  selector: 'app-adicionar-evento',
  templateUrl: './adicionar-evento.component.html',
  styleUrls: []
})
export class AdicionarEventoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public eventoForm: FormGroup;
  public errors: any[] = [];
  public evento: Evento;
  public categorias: Categoria[];
  public gratuito: Boolean;
  public online: Boolean;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public displayMessage: { [key: string]: string } = {};

  constructor(private fb: FormBuilder, private router: Router, private snotifireService: SnotifireService, private eventoService : EventoService) {
    this.validationMessages = {
      nome: {
        require: 'O Nome é requirido',
        minlength: 'O Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Nome precisa ter no máximo 150 caracteres'
      },
      dataInicio: {
        require: 'O dataInicio é requirido',
      },
      dataFim: {
        require: 'O dataFim é requirido',


      },
      organizadorId: {
        require: 'O organizador é requirido',
      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.evento = new Evento();
    this.evento.endereco = new Endereco();
  }

  ngOnInit() {
    this.eventoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      // cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      organizadorId: ['', [Validators.required]],
      decricaoCurta: [''],
      descricaolonga: [''],
      dataInicio: ['', [Validators.required]],
      datafim: ['', [Validators.required]],
      gratuito: [''],
      valor: ['0'],
      online: [''],
      nomeEmpresa: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      Token: [],
      role: []

    });

    this.eventoService.ObterCategoria()
    .subscribe(
      categorias => this.categorias = categorias,
      error => this.errors = error
      
    );
  }


  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.eventoForm);
    });
  }

  adicionarEvento() {
    if (this, this.eventoForm.valid && this.eventoForm.dirty) {

      const e = Object.assign({}, this.eventoForm, this.eventoForm.value);
      let user = this.eventoService.obterUsuario();
      e.dataInicio = DateUtils.getMyDatePickerDate(e.dataInicio);
      e.dataFim = DateUtils.getMyDatePickerDate(e.dataFim);
      e.organizadorId = user.Id;
      e.endereco.logradouro = e.logradouro;
      e.endereco.numero = e.numero;
      e.endereco.complemento = e.complemento;
      e.endereco.bairro = e.bairro;
      e.endereco.cep = e.cep;
      e.endereco.cidade = e.cidade;
      e.endereco.estado = e.estado;

      this.eventoService.registrarEvento(e).subscribe(
        result => {this.onSalveComplete},
        fail => {this.onError(fail)}
      );
    }
  }

  onSalveComplete(response: any){
    this.eventoForm.reset();
    this.errors = [];
    let toasterMessage =  this.snotifireService.success('Registro realizado com Sucesso!', 'Bem vindo', {
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

  onError(fail: any) {

  this.snotifireService.error('Ocorreu um erro!', 'OPS!', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
    this.errors = fail.error.errors;

  }
}
