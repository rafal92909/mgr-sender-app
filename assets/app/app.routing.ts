import { LogoComponent } from './logo.component';
import { SendDataComponent } from './send-data/send-data.component';
import { SetDataComponent } from './set-data/set-data.component';

import { AuthenticationComponent } from './authorize/authentication.component';
import { Routes, RouterModule } from "@angular/router";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/logo', pathMatch: 'full' },
    { path: 'set-data', component: SetDataComponent },    
    { path: 'send-data', component: SendDataComponent },
    { path: 'authorize', component: AuthenticationComponent, loadChildren: './authorize/authorize.module#AuthorizeModule' },
    { path: 'logo', component: LogoComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);