import { SetDataServie } from './set-data/set-data.service';
import { SetDataAddItemComponent } from './set-data/set-data-list/set-data-add-item/set-data-add-item.component';
import { SetDataDataFrameFormComponent } from './set-data/set-data-detail/set-data-data-frame/set-data-data-frame-form/set-data-data-frame-form.component';
import { SetDataDescFrameComponent } from './set-data/set-data-detail/set-data-desc-frame/set-data-desc-frame.component';
import { SetDataDataFrameComponent } from './set-data/set-data-detail/set-data-data-frame/set-data-data-frame.component';
import { SetDataItemComponent } from './set-data/set-data-list/set-data-item/set-data-item.component';
import { SetDataListComponent } from './set-data/set-data-list/set-data-list.component';
import { SetDataDetailComponent } from './set-data/set-data-detail/set-data-detail.component';
import { ErrorServie } from './error/error.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './authorize/logout.component';
import { LoginComponent } from './authorize/login.component';
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
import { ErrorComponent } from './error/error.component';

@NgModule({
    declarations: [
        AppComponent,        
        HeaderComponent,
        AuthenticationComponent,
        LoginComponent,
        LogoutComponent,        
        SetDataComponent,
        SendDataComponent,
        LogoComponent,
        ErrorComponent,
        SetDataDetailComponent,
        SetDataListComponent,
        SetDataItemComponent,
        SetDataDataFrameComponent,
        SetDataDescFrameComponent,
        SetDataDataFrameFormComponent,
        SetDataAddItemComponent
],
    imports: [
        BrowserModule, 
        routing, 
        HttpModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [AuthorizeService, ErrorServie, SetDataServie],
    bootstrap: [AppComponent]
})
export class AppModule {

}