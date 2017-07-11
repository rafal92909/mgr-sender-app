import { DataFramePart } from './../data-frame.model';
import { Item } from './../item.model';
import { ErrorServie } from './../error/error.service';
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Http, Response, Headers } from "@angular/http";

// http://becausejavascript.com/node-js-event-loop/
// https://github.com/sepmein/infiniteLoop
// https://stackoverflow.com/questions/34824460/why-does-a-while-loop-block-the-node-event-loop

@Injectable()
export class SendDataServie {
    private items: Item[] = [];
    private dataFrameParts: DataFramePart[] = [];
    resetDataDetail = new EventEmitter();

    constructor(private http: Http, private errorService: ErrorServie) { }

    resetDataDetailFunc() {
        this.resetDataDetail.emit();
    }

    getItems() {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.get('http://localhost:3000/send-data/get-items' + token)
            .map((response: Response) => {
                const mongoItems = response.json().obj;
                let newItems: Item[] = [];
                for (let item of mongoItems) {
                    newItems.push(new Item(
                        item.name,
                        item.desc,
                        item._id
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

        getDataFramePart(itemId: String) {
        const token = localStorage.getItem('token')
            ? '&token=' + localStorage.getItem('token')
            : '';
        return this.http.get('http://localhost:3000/send-data/get-data-frame-parts?itemId=' + itemId + token)
            .map((response: Response) => {
                const mongoDataFrameParts = response.json().obj;
                let newDataFrameParts: DataFramePart[] = [];
                for (let dataFramePart of mongoDataFrameParts) {
                    newDataFrameParts.push(new DataFramePart(
                        dataFramePart.key,
                        dataFramePart.type,
                        dataFramePart.value,
                        dataFramePart.item._id,
                        dataFramePart._id
                    ));
                }
                this.dataFrameParts = newDataFrameParts;
                return this.dataFrameParts;
            })
            .catch(
            (error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            }
            );
    }

}
