import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login.component";
import { SignupComponent } from "./signup.component";
import { LogoutComponent } from "./logout.component";

const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },    
    { path: 'logout', component: LogoutComponent }
];

export const authorizeRouting = RouterModule.forChild(AUTH_ROUTES);