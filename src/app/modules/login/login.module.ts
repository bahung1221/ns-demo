import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./page/login/login.component";

@NgModule({
    imports: [
        LoginRoutingModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        LoginComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class LoginModule { }
