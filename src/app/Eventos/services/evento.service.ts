import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { Categoria, Endereco, Evento } from "../modls_eventos/evento";
import { SeviceBase } from "../../services/sevice.base";



@Injectable()
export class EventoService extends SeviceBase{

    constructor(private http: HttpClient){super()}


        ObterCategoria() : Observable<Categoria[]>{
            return this.http
            .get<Categoria[]>(this.UrlServiceV1 + "eventos/categorias")
            .pipe(catchError(super.seviceError));
        }

        registrarEvento(evento: Evento) : Observable<Evento[]>{
            return this.http
            .post(this.UrlServiceV1 + "eventos", evento, super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),catchError(super.seviceError));
        }

        
        obterTodos() : Observable<Evento[]>{
            return this.http
            .get<Evento[]>(this.UrlServiceV1 + "eventos")
            .pipe(catchError(super.seviceError));
        }

        obterEvento(id: string):Observable<Evento>{
            return this.http
            .get<Evento>(this.UrlServiceV1 + "eventos/" + id)
            .pipe(
            catchError(super.seviceError));
        };

       
        obterMeuEvento(id: string):Observable<Evento>{
            return  this.http
             .get<Evento>(this.UrlServiceV1 + "eventos/meus-eventos/" + id,super.ObterAuthHeaderJson())
             .pipe(
             catchError(super.seviceError));
         };

         obterMeusEventos() : Observable<Evento[]>{
            return this.http
            .get<Evento[]>(this.UrlServiceV1 + "eventos/meus-eventos",super.ObterAuthHeaderJson())
            .pipe(catchError(super.seviceError));
        }

        atualizarEvento(evento: Evento):Observable<Evento>{
            return this.http
            .put(this.UrlServiceV1 + "eventos",evento,super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),
            catchError(super.seviceError));
        };

        ExcluirEvento(id: string):Observable<Evento>{
            return this.http
            .delete(this.UrlServiceV1 + "eventos/" + id,super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),
            catchError(super.seviceError));
        };
       

        adicionarEndereco(endereco: Endereco):Observable<Endereco>{
            let response =  this.http
            .post(this.UrlServiceV1 + "endereco",endereco,super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),
            catchError(super.seviceError));
            return response;
        };

        atualizarEndereco(endereco: Endereco):Observable<Endereco>{
            let response = this.http
            .put(this.UrlServiceV1 + "endereco",endereco,super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),
            catchError(super.seviceError));
            return response;
        };
}