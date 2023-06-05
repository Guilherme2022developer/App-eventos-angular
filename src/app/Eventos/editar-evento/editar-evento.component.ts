import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifireService } from 'ngx-snotifire';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { EventoService } from 'src/app/services/evento.service';
import { GenericValidator } from 'src/app/utils/generic.form.validator';
import { Categoria, Endereco, Evento } from '../modls_eventos/evento';
import { DateUtils } from 'src/app/utils/data-type-utils';
import { CurrencyUtils } from 'src/app/utils/CurrencyUtils';


@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();


  public eventoForm: FormGroup;
  public enderecoForm: FormGroup;
  public errors: any[] = [];
  public evento: Evento;
  public categorias: Categoria[];
  public gratuito: Boolean;
  public online: Boolean = false;
  public isDataAvailable : boolean;
  public modalVisible : boolean = false;
  public EventoId: string;
  public sub: Subscription;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public displayMessage: { [key: string]: string } = {};

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private snotifireService: SnotifireService, private eventoService: EventoService) {
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


  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.eventoForm);
    });
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

    this.enderecoForm = this.fb.group({
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required]
    });


    this.sub = this.route.params.subscribe(
      params => {
        this.EventoId = params['id'];
        this.obterEvento(this.EventoId);
      }
    );

    this.eventoService.ObterCategoria()
      .subscribe(
        categorias => this.categorias = categorias,
        error => this.errors = error);
  }

  obterEvento(id: string){
    this.eventoService.obterMeuEvento(id).subscribe((evento: Evento)=> {this.preencherFormEvento(evento),this.isDataAvailable = true})
  }

  preencherFormEvento(evento: Evento): void{
   this.evento = evento;
   let valorBrl = CurrencyUtils.ToPrice(this.evento.valor);

   this.eventoForm.patchValue({
    nome: this.evento.nome,
    categoriaId: this.evento.categoriaId,
    descricaoCurta: this.evento.decricaoCurta,
    descricaoLonga: this.evento.descricaoConga,
    dataInicio: DateUtils.setMyDatePickerDate(this.evento.dataInicio),
    dataFim: DateUtils.setMyDatePickerDate(this.evento.dataFim),
    gratuito: this.evento.gratuito,
    valor: valorBrl,
    online: this.evento.online,
    nomeEmpresa: this.evento.nomeEmpresa
   });

    this.online = this.evento.online;
    this.gratuito = this.evento.gratuito;

   if(this.evento.endereco){
    this.enderecoForm.patchValue({
      logradouro: this.evento.endereco.logradouro,
      numero: this.evento.endereco.numero,
      complememto: this.evento.endereco.complemento,
      bairro: this.evento.endereco.bairro,
      cep: this.evento.endereco.cep,
      cidade: this.evento.endereco.cidade,
      estado: this.evento.endereco.estado
    });
   }

  }

  editarEvento(){
    if(this.eventoForm.dirty && this.eventoForm.valid){
      let p = Object.assign({},this.evento,this.eventoForm.value);
      let user = this.eventoService.obterUsuario();
      p.organizadorId = user.id;
      p.dataInicio = DateUtils.getMyDatePickerDate(p.dataInicio);
      p.DataFim = DateUtils.getMyDatePickerDate(p.DataFim);
      p.valor = CurrencyUtils.ToDecimal(p.valor);

      this.eventoService.atualizarEvento(p).subscribe(
        result => {this.onSalveComplete},
        fail => {this.onError(fail)}
      );
    }
  }
atualizarEndereco(){
  if(this.enderecoForm.dirty && this.enderecoForm.valid){
    let p = Object.assign({},this.enderecoForm.value);
    p.eventoId = this.EventoId;
    if(this.evento.endereco){
      p.id = this.evento.endereco.id;
      this.eventoService.atualizarEndereco(p).subscribe(
        result => {this.onEnderecoSaveComplete},
        fail => {this.onError(fail)}
      );
    }else{
      this.eventoService.adicionarEndereco(p).subscribe(
        result => {this.onEnderecoSaveComplete},
        fail => {this.onError(fail)}
      );
    }
  }
}

onEnderecoSaveComplete(): void{
  this.hideModal();
  this.snotifireService.success('Endereço Atualizado com Sucesso!', 'Bem vindo', {
    timeout: 2000,
    showProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });

  this.obterEvento(this.evento.id)
  
}

  onSalveComplete(response: any){
    this.eventoForm.reset();
    this.errors = [];
    let toasterMessage =  this.snotifireService.success('Atualizado com Sucesso!', 'Bem vindo', {
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

  public showModal(): void{
    this.modalVisible = true
  }

  public hideModal(): void{
    this.modalVisible = false
  }

}
