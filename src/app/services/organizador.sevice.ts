import { Injectable } from "@angular/core";
import { SeviceBase } from "./sevice.base";
import { HttpClient } from '@angular/common/http'
import { Organizador } from "../usuario/inscricao/models/organizador";
import { catchError, Observable, map } from "rxjs";


@Injectable()
export class OrganizadorService extends SeviceBase {

    constructor(private http: HttpClient){super()}

    registrarOrganizador(organizador: Organizador): Observable<Organizador>{
        return this.http
        .post(this.UrlServiceV1 + 'registrar-nova-conta',organizador,super.ObterHeaderJson())
        .pipe(
            map(super.extractData),
            catchError(super.seviceError)
        );
    } 

    login(organizador: Organizador): Observable<Organizador>{
        return this.http
        .post(this.UrlServiceV1 + 'entrar',organizador,super.ObterHeaderJson())
        .pipe(
            map(super.extractData),
            catchError(super.seviceError)
        );
    } 

    
}

