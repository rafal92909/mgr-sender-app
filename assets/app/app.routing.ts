import { ErrorComponent } from './error/error.component';
import { LogoutComponent } from './authorize/logout.component';
import { LoginComponent } from './authorize/login.component';
import { LogoComponent } from './logo.component';
import { SendDataComponent } from './send-data/send-data.component';
import { SetDataComponent } from './set-data/set-data.component';


import { AuthenticationComponent } from './authorize/authentication.component';
import { Routes, RouterModule } from "@angular/router";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/logo', pathMatch: 'full' },
    { path: 'set-data', component: SetDataComponent },    
    { path: 'send-data', component: SendDataComponent },
    { path: 'login', component: LoginComponent },    
    { path: 'logout', component: LogoutComponent },    
    { path: 'logo', component: LogoComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);