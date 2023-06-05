import { Injectable} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ɵgetDOM  } from "@angular/platform-browser";
import { stringUtils } from "../utils/string.utils";

@Injectable()
export class SeoService{
   private titleService: Title;
   private headElement : HTMLElement;
   private metaDescription: HTMLElement;   
   private metaKeywords: HTMLElement;
   private robots: HTMLElement;
   private DOM : any;
  

   public constructor(titleService: Title){
    this.titleService = titleService;
    this.DOM = document;
    this.headElement = this.DOM.querySelector("head");
    this.setTitle('');
   }

   public setSeoDate(seoModel: SeoModel){
     this.setTitle(seoModel.title);
     this.setMetaRobots(seoModel.robots);
     this.setMetaDescription(seoModel.description);
     this.setMetaKeywords(seoModel.keywords);
   }

   private setTitle(newTitle: string){
    if(stringUtils.isnullOrEmty(newTitle)){newTitle = "Defina um Titulo"}
      this.titleService.setTitle(newTitle + " - Eventos.IO");
   }

   private setMetaDescription(description : string){
    this.metaDescription = this.getOrCreateMetaElement('description');
    if(stringUtils.isnullOrEmty(description)){description = "Aqui você encontra um evento técnico próximo de você"}
     this.metaDescription.setAttribute('content', description);
   }

   private setMetaKeywords(Keywords: string){
    this.metaKeywords = this.getOrCreateMetaElement('keywords');
    if(stringUtils.isnullOrEmty(Keywords)){Keywords = "eventos,workshops,encontros,congressos,comunidades,tecnologias"}
     this.metaKeywords.setAttribute('content', Keywords);
   }

   private setMetaRobots(robots: string){
    this.robots = this.getOrCreateMetaElement('robots');

     if(stringUtils.isnullOrEmty(robots)){robots = "all"}

      this.robots.setAttribute('content',robots);

   }

   private getOrCreateMetaElement(name: string): HTMLElement{
    let el: HTMLElement;
    el = this.DOM.querySelector('meta[name=' + name + ']');
    if(el === null){
        el = this.DOM.createElement('meta');
        el.setAttribute('name', name);
        this.headElement.appendChild(el);
    }
    return el;
   }

}

export class SeoModel{
    public title: string = '';
    public description: string = '';
    public robots: string = '';
    public keywords: string =  '';
}