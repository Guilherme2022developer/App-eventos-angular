import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifireService } from 'ngx-snotifire';
import { fromEvent, merge, Observable } from 'rxjs';
import { OrganizadorService } from 'src/app/services/organizador.sevice';
import { GenericValidator } from 'src/app/comom/data-type-utils/validation/generic.form.validator';
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
      email: {
        require: 'O Email é requirido',
        email: 'Informe o e-mail',

      },
      senha: {
        require: 'O Senha é requirido',
        minlength: 'O Senha precisa ter no mínimo 8 caracteres',

      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
  }


  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(150)]],
    });
  }

  ngAfterViewInit() {
    let controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.loginForm);
    });
  }

  login() {

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
