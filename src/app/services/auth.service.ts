import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";


@Injectable()
export class AuthService implements CanActivate {


    public token: string | null = null;
    public user: any;
    
    constructor(private router: Router){

    }

    canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.token = localStorage.getItem('eio.token');
        this.user = JSON.parse(localStorage.getItem('eio.user') || '{}');;
        if(!this.token){
         this.router.navigate(['/entrar'])
        }

        if(!this.user){
            this.router.navigate(['/entrar'])
           }
        
        let claim: any = routeAc.data[0]
        if(claim !== undefined){
            let claim: any = routeAc.data['claim']
            if(claim){
                if(!this.user.claims){
                    this.router.navigate(['/acesso-negado'])
                }

                let userClaims = this.user.claims.some((x: { type: any; value: any; }) => {
                    return x.type === claim.nome && x.value === claim.valor;
                });
            }
        }

        return true;
    }

}