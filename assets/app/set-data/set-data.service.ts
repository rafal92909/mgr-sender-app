import { Item } from './../item.model';
import { ErrorServie } from './../error/error.service';
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Http, Response, Headers } from "@angular/http";


@Injectable()
export class SetDataServie {
    private items: Item[] = [];

    newItem = new EventEmitter();
    constructor(private http: Http, private errorService: ErrorServie) { }

    newItemClick() {
        this.newItem.emit();
    }

    addNewItem(item: Item) {        
        const body = JSON.stringify(item);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post('http://localhost:3000/set-data' + token, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const i = new Item(
                    result.obj.name,
                    result.obj.desc,
                    result.obj._id                    
                )
                this.items.push(i);
                return result;
            })
            .catch(
                (error: Response) => { 
                    this.errorService.handleError(error.json());
                    return Observable.throw(error.json())
                }                    
            );
    }
    
    getItems() {  
                const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';     
        return this.http.get('http://localhost:3000/set-data' + token)
            .map((response: Response) => {
                const mongoItems = response.json().obj;
                let newItems: Item[] = [];
                for (let item of mongoItems) {
                    newItems.push(new Item(
                        item.name, 
                        item.desc, 
                        item._id,                         
                    ));
                }
                this.items = newItems;
                return this.items;
            })
            .catch(
            (error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            }
            );
    }

}