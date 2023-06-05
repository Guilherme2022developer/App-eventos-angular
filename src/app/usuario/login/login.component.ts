import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifireService } from 'ngx-snotifire';
import { fromEvent, merge, Observable } from 'rxjs';
import { OrganizadorService } from 'src/app/services/organizador.sevice';
import { GenericValidator } from 'src/app/utils/generic.form.validator';
import { Organizador } from '../inscricao/models/organizador';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent  implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  loginForm: FormGroup;
  organizador: Organizador;
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  errors: any[] = []

  constructor(private fb: FormBuilder, private organizadorSevice: OrganizadorService, private router: Router, private snotifireService: SnotifireService  ) {

    this.validationMessages = {
      // nome: {
      //   require: 'O Nome é requirido',
      //   minlength: 'O Nome precisa ter no mínimo 2 caracteres',
      //   maxlength: 'O Nome precisa ter no máximo 150 caracteres'
      // },
      // cpf: {
      //   require: 'O CPF é requirido',
      //   minlength: 'O CPF precisa ter no mínimo 2 caracteres',
      //   maxlength: 'O CPF precisa ter no máximo 150 caracteres'
      //   //rangeLength: 'O CPF precisa ter no conter 11 caracteres',
      // },
      Email: {
        require: 'O Email é requirido',
        email: 'Informe o e-mail',

      },
      Password: {
        require: 'O Senha é requirido',
        minlength: 'O Senha precisa ter no mínimo 6 caracteres',

      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
  }


  ngOnInit() {
    this.loginForm = this.fb.group({
      //nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
     // cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
     Email: ['', [Validators.required, Validators.email]],
     Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
     Token:[],
     role:[]

    });
  }

  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.loginForm);
    });
  }

  login() {

    //this.displayMessage = this.genericValidator.processMessages(this.inscricaoForm);

    if (this, this.loginForm.valid && this.loginForm.dirty) {

      const org = Object.assign({}, this.organizador, this.loginForm.value);
      
      this.organizadorSevice.login(org)
      .subscribe(
        result => {this.onSalveComplete(result)},
        fail => {this.onError(fail)}
      )

    }

  }

  onSalveComplete(response: any){
    this.loginForm.reset();
    this.errors = [];
    localStorage.setItem('eio.token',response.token);
    localStorage.setItem('eio.user',JSON.stringify(response.email));
    let toasterMessage =  this.snotifireService.success('Login realizado com Sucesso!', 'Bem vindo', {
      timeout: 4000,
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
