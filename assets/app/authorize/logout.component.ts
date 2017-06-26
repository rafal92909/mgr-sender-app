import { Router } from '@angular/router';
import { AuthorizeService } from './authorize.service';
import { Component } from "@angular/core";

@Component({
    selector: 'mgr-logout',
    template: ''
})
export class LogoutComponent {
    constructor(private authorizeService: AuthorizeService, private router: Router) { 
        this.onLogout();    
    }
    onLogout() {
        this.authorizeService.logout();
        this.router.navigate(['/authorize', 'login']);
    }
}