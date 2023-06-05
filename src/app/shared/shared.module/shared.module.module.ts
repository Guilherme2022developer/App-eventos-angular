import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { FooterComponent } from "../footer/footer.component";
import { MenuLoginComponent } from "../menu-login/menu-login.component";
import { MenuSuperiorComponent } from "../menu-superior/menu-superior.component";




@NgModule({
    imports: [
        CommonModule, 
        RouterModule,
        CollapseModule 
        ],
    declarations: [
        MenuSuperiorComponent,
        FooterComponent,
        MenuLoginComponent
        ],
    exports: [
        MenuSuperiorComponent,
        FooterComponent,
        MenuLoginComponent
        ]
})
export class SharedModule { }