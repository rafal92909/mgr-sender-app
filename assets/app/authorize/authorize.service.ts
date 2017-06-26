import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx'; // importujemy dla funkcji map (przetworzenie odpowiedzi od serwera)
import { Observable } from "rxjs";


@Injectable()
export class AuthorizeService {
    isLogin = false;
    constructor(private http: Http) { }

    signup() {
        const user = '{ "userName": "user_json" }'; 
        const body = user; //JSON.stringify(user);        
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('http://localhost:3000/authorize', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => error.json());             
    }

    login() {
        const user = '{ "userName": "user_json" }'; 
        const body = user;
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('http://localhost:3000/authorize/login', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => error.json()); 
    }

    logout() {
        localStorage.clear();
        console.log("LOGOUT");
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}