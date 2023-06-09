import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifireService } from 'ngx-snotifire';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { CurrencyUtils } from 'src/app/comom/data-type-utils/CurrencyUtils';
import { DateUtils } from 'src/app/comom/data-type-utils/data-type-utils';
import { GenericValidator } from 'src/app/comom/data-type-utils/validation/generic.form.validator';
import { EventoService } from 'src/app/Eventos/services/evento.service';
import { Categoria, Endereco, Evento } from '../modls_eventos/evento';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html'
})
export class EditarEventoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public errors: any[] = [];
  public errorsEndereco: any[] = [];
  public eventoForm: FormGroup;
  public enderecoForm: FormGroup;
  public evento: Evento;
  public endereco: Endereco;
  public categorias: Categoria[];
  public eventoId: string = "";

  public gratuito: boolean;
  public online: boolean;
  public sub: Subscription;
  public modalVisible: boolean = true;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute,
    private snotifireService: SnotifireService
  ) {
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
    this.modalVisible = false;
  }

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  ngOnInit() {
    this.eventoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      categoriaId: ['', Validators.required],
      descricaoCurta: '',
      descricaoLonga: '',
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      gratuito: '',
      valor: '0',
      online: '',
      nomeEmpresa: ''
    });

    this.enderecoForm = this.fb.group({
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: '',
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
    });

    this.sub = this.route.params.subscribe(params => {
      this.eventoId = params['id'];
      this.obterEvento(this.eventoId);
    });

    this.eventoService.ObterCategoria().subscribe(
      categorias => this.categorias = categorias,
      error => this.errors
    );
  }

  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, 'blur')
    );

    merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.eventoForm);
    });
  }

  obterEvento(id: string) {
    this.eventoService.obterEvento(id).subscribe(
      evento => this.preencherFormEvento(evento)
    );
  }

  preencherFormEvento(evento: Evento): void {
    this.evento = evento;
    let valorBrl = CurrencyUtils.ToPrice(this.evento.valor);

    this.eventoForm.patchValue({
      nome: this.evento.nome,
      categoriaId: this.evento.categoriaId,
      descricaoCurta: this.evento.descricaoCurta,
      descricaoLonga: this.evento.descricaoLonga,
      dataInicio: DateUtils.setMyDatePickerDate(this.evento.dataInicio),
      dataFim: DateUtils.setMyDatePickerDate(this.evento.dataFim),
      gratuito: this.evento.gratuito,
      valor: valorBrl,
      online: this.evento.online,
      nomeEmpresa: this.evento.nomeEmpresa,
    });

    if (this.evento.endereco) {
      this.enderecoForm.patchValue({
        logradouro: this.evento.endereco.logradouro,
        numero: this.evento.endereco.numero,
        complemento: this.evento.endereco.complemento,
        bairro: this.evento.endereco.bairro,
        cep: this.evento.endereco.cep,
        cidade: this.evento.endereco.cidade,
        estado: this.evento.endereco.estado
      });
    }
  }

  editarEvento() {
    if (this.eventoForm.dirty && this.eventoForm.valid) {
      let p = Object.assign({}, this.evento, this.eventoForm.value);
      let user = this.eventoService.obterUsuario();
      p.organizadorId = user.id;
      p.dataInicio = DateUtils.getMyDatePickerDate(p.dataInicio);
      p.dataFim = DateUtils.getMyDatePickerDate(p.dataFim);
      p.valor = CurrencyUtils.ToDecimal(p.valor);

      this.eventoService.atualizarEvento(p).subscribe(
        result => this.onSalveComplete(result),
        fail => this.onError(fail)
      );
    }
  }

  atualizarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {
      let p = Object.assign({}, this.endereco, this.enderecoForm.value);
      p.eventoId = this.eventoId;

      if (this.evento.endereco) {
        p.id = this.evento.endereco.id;
        this.eventoService.atualizarEndereco(p).subscribe(
          result => this.onEnderecoSaveComplete(),
          fail => this.onErrorEndereco(fail)
        );
      } else {
        this.eventoService.adicionarEndereco(p).subscribe(
          result => this.onEnderecoSaveComplete(),
          fail => this.onErrorEndereco(fail)
        );
      }
    }
  }

  onEnderecoSaveComplete(): void {
    this.hideModal();

    let toasterMessage = this.snotifireService.success('Endereço Atualizado com Sucesso!', 'Sucesso', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
    this.obterEvento(this.eventoId);
  }

  onSalveComplete(response: any) {
    this.errors = [];
    let toasterMessage = this.snotifireService.success('Obaa deu certo', 'Sucesso!', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

    if (toasterMessage) {
      toasterMessage.eventEmitter.subscribe(() => {
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

  onErrorEndereco(fail: any) {
    this.snotifireService.error('Ocorreu um erro!', 'OPS!', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
    this.errorsEndereco = fail.error.errors;
  }

  public showModal(): void {
    this.modalVisible = true;
  }
  

  public hideModal(): void {
    this.modalVisible = false;
  }
}
