import { LogoComponent } from './logo.component';
import { SetDataComponent } from './set-data/set-data.component';
import { AuthenticationComponent } from './authorize/authentication.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthorizeService } from './authorize/authorize.service';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';

import { AppComponent } from "./app.component";
import { HeaderComponent } from './header.component';
import { SendDataComponent } from './send-data/send-data.component';

@NgModule({
    declarations: [
        AppComponent,        
        HeaderComponent,
        AuthenticationComponent,
        SetDataComponent,
        SendDataComponent,
        LogoComponent
],
    imports: [
        BrowserModule, 
        routing, 
        HttpModule
    ],
    providers: [AuthorizeService],
    bootstrap: [AppComponent]
})
export class AppModule {

}