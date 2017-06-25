import { authorizeRouting } from './authorize.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [
        LogoutComponent,
        LoginComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        authorizeRouting
    ]
})

export class AuthorizeModule {

}