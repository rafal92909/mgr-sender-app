import { AuthorizeService } from './authorize.service';
import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'mgr-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    myForm: FormGroup;

    constructor(private authorizeService: AuthorizeService, private router: Router) { }

    onSubmit() {        
        this.authorizeService.login().subscribe(
            data => console.log(data), 
            error => console.error(error)
        );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}