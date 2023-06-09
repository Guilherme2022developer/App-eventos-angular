import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifireService } from 'ngx-snotifire';
import { fromEvent, merge, Observable } from 'rxjs';
import { EventoService } from 'src/app/Eventos/services/evento.service';
import { GenericValidator } from 'src/app/comom/data-type-utils/validation/generic.form.validator';
import { Categoria, Endereco, Evento } from '../modls_eventos/evento';
import { DateUtils } from 'src/app/comom/data-type-utils/data-type-utils';
import { CurrencyUtils } from 'src/app/comom/data-type-utils/CurrencyUtils';


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

 

  constructor(private fb: FormBuilder, private router: Router, private snotifireService: SnotifireService, private eventoService : EventoService) {
    this.validationMessages = {
      nome: {
        required: 'O Nome é requerido.',
        minlength: 'O Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Nome precisa ter no máximo 150 caracteres'
      },
      dataInicio: {
        required: 'Informe a data de início'
      },
      dataFim: {
        required: 'Informe a data de encerramento'
      },
      categoriaId: {
        required: 'Informe a categoria'
      }
    };
    
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.evento = new Evento();
    this.evento.endereco = new Endereco();
  }

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public displayMessage: { [key: string]: string } = {};
  
  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      nome: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(150)]],
      categoriaId: ['', Validators.required],
      descricaoCurta: '',
      descricaoLonga: '',
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      gratuito: '',
      valor: '0',
      online: '',
      nomeEmpresa: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      estado: '',
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
    if (this.eventoForm.dirty && this.eventoForm.valid) {
      let user = this.eventoService.obterUsuario();

      let p = Object.assign({}, this.evento, this.eventoForm.value);
      p.organizadorId = user.id;
      
      p.nome = p.nome;
      p.descricaoCurta = p.descricaoCurta;
      p.descricaoLonga = p.descricaoLonga;
      p.gratuito = p.gratuito;
      p.valor = p.valor;
      p.online = p.online;
      p.nomeEmpresa = p.nomeEmpresa
      p.valor = CurrencyUtils.ToDecimal(p.valor);
      p.dataInicio = DateUtils.getMyDatePickerDate(p.dataInicio);
      p.dataFim = DateUtils.getMyDatePickerDate(p.dataFim);
      p.endereco.logradouro = p.logradouro;
      p.endereco.numero = p.numero;
      p.endereco.complemento = p.complemento;
      p.endereco.bairro = p.bairro;
      p.endereco.cep = p.cep;
      p.endereco.cidade = p.cidade;
      p.endereco.estado = p.estado;

      this.eventoService.registrarEvento(p).subscribe(
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
        this.router.navigate(['/eventos/meus-eventos']);
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
