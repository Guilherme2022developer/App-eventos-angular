import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html'
})
export class MenuSuperiorComponent {
  public token: string | null = null;
  constructor() { }
  
  public isCollapsed: boolean = true;

  usuarioLogado(): boolean {
    this.token = localStorage.getItem('eio.token');
    if (!this.token) {
      return false;
    }

    return true;
  }
}
