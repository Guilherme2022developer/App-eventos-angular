import { Component } from '@angular/core';
import { SnotifireService } from "ngx-snotifire";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  isCollapsed: boolean = true;

  constructor(private snotifireService: SnotifireService) {}

  showError() {
    this.snotifireService.error('Houve um erro!', 'Erro');
  }
}

