
import { AuthenticationComponent } from './authorize/authentication.component';
//import { MessagesComponent } from './messages/messages.component';
import { Routes, RouterModule } from "@angular/router";
const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    //{ path: 'data', component: MessagesComponent },
    { path: 'authorize', component: AuthenticationComponent, loadChildren: './authorize/authorize.module#AuthorizeModule' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);