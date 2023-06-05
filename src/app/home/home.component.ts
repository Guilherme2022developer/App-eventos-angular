import { Component, OnInit } from '@angular/core';
import { SeoModel, SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(seoService: SeoService){
   
    let seoModel: SeoModel = <SeoModel>{
      title: 'Seja bem vindo',
      robots: 'Index,Follow'
      
    };
  seoService.setSeoDate(seoModel);
  }


  ngOnInit(){

  }

}
