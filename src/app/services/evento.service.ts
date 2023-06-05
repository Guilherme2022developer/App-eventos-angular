import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { Categoria, Endereco, Evento } from "../Eventos/modls_eventos/evento";
import { SeviceBase } from "./sevice.base";



@Injectable()
export class EventoService extends SeviceBase{

    constructor(private http: HttpClient){super()}


        ObterCategoria() : Observable<Categoria[]>{
            return this.http
            .get<Categoria[]>(this.UrlServiceV1 + "eventos/obter-categorias")
            .pipe(catchError(super.seviceError));
        }

        registrarEvento(evento: Evento) : Observable<Evento[]>{
            return this.http
            .post(this.UrlServiceV1 + "evento", evento, super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),catchError(super.seviceError));
        }

         obterUsuario() {
            const item = localStorage.getItem('eio.user');
            if (item !== null) {
                return JSON.parse(item);
            }
            return null;
        }

        obterTodos() : Observable<Evento[]>{
            return this.http
            .get<Evento[]>(this.UrlServiceV1 + "eventos/obter-todos")
            .pipe(catchError(super.seviceError));
        }

        atualizarEvento(evento: Evento):Observable<Evento>{
            return this.http
            .put(this.UrlServiceV1 + "evento/atualizar",evento,super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),
            catchError(super.seviceError));
        };

        ExcluirEvento(id: string):Observable<Evento>{
            return this.http
            .delete(this.UrlServiceV1 + "evento/delete/" + id,super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),
            catchError(super.seviceError));
        };
        obterMeusEventos():Observable<Evento>{
            return this.http
            .get(this.UrlServiceV1 + "eventos/meus-eventos",super.ObterAuthHeaderJson())
            .pipe(map(super.extractData),
            catchError(super.seviceError));
        };

        obterEvento(id: string):Observable<Evento>{
            return this.http
            .get<Evento>(this.UrlServiceV1 + "eventos/" + id)
            .pipe(
            catchError(super.seviceError));
        };
//ajustar pra pegar somente do responsavel passando idevento e idorganizador
        obterMeuEvento(id: string):Observable<Evento>{
           return  this.http
            .get<Evento>(this.UrlServiceV1 + "eventos/" + id)
            .pipe(
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