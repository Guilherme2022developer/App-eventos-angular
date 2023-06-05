import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifireService } from 'ngx-snotifire';
import { fromEvent, merge, Observable } from 'rxjs';
import { OrganizadorService } from 'src/app/services/organizador.sevice';
import { GenericValidator } from 'src/app/comom/data-type-utils/validation/generic.form.validator';
import { Organizador } from './models/organizador';


@Component({
  selector: 'app-inscricao',
  templateUrl: './inscricao.component.html',
  styleUrls: ['./inscricao.component.css']
})
export class InscricaoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  inscricaoForm: FormGroup;
  organizador: Organizador;
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  errors: any[] = [];

  constructor(private fb: FormBuilder, private organizadorSevice: OrganizadorService, private router: Router, private snotifireService: SnotifireService  ) {

    this.validationMessages = {
      nome: {
        required: 'O Nome é requerido.',
        minlength: 'O Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Nome precisa ter no máximo 150 caracteres'
      },
      cpf: {
        required: 'Informe o CPF',
        rangeLength: 'CPF deve conter 11 caracteres'
      },
      email: {
        required: 'Informe o e-mail',
        email: 'Email invalido'
      },
      senha: {
        required: 'Informe a senha',
        minlength: 'A senha deve possuir no mínimo 6 caracteres'
      },
      senhaConfirmacao: {
        required: 'Informe a senha novamente',
        minlength: 'A senha deve possuir no mínimo 6 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };

     this.genericValidator = new GenericValidator(this.validationMessages);
    this.organizador = new Organizador();
  }

  ngOnInit() {
    this.inscricaoForm = this.fb.group({
     nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
     cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
     email: ['', [Validators.required, Validators.email]],
     senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
     senhaConfirmacao: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
     Token:[],
     role:[]

    });
  }

  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.inscricaoForm);
    });
  }

  adicionarOrganizador() {

    if (this, this.inscricaoForm.valid && this.inscricaoForm.dirty) {

      const org = Object.assign({}, this.organizador, this.inscricaoForm.value);
      
      this.organizadorSevice.registrarOrganizador(org)
      .subscribe(
        result => {this.onSalveComplete(result)},
        fail => {this.onError(fail)}
      )

    }

  }

  onSalveComplete(response: any){
    this.inscricaoForm.reset();
    this.errors = [];
    localStorage.setItem('eio.token',response.token);
    localStorage.setItem('eio.user',JSON.stringify(response.email));
    let toasterMessage =  this.snotifireService.success('Registro realizado com Sucesso!', 'Bem vindo', {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

    if(toasterMessage){
      toasterMessage.eventEmitter.subscribe(()=>{
        this.router.navigate(['/home']);
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
