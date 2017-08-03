import { DataFramePart } from './../data-frame.model';
import { Item } from './../item.model';
import { ErrorServie } from './../error/error.service';
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Http, Response, Headers } from "@angular/http";


@Injectable()
export class SetDataServie {
    private items: Item[] = [];
    private dataFrameParts: DataFramePart[] = [];

    newItem = new EventEmitter();
    newDataPart = new EventEmitter();
    resetDataDetail = new EventEmitter();
    newSetDataEmit = new EventEmitter();
    constructor(private http: Http, private errorService: ErrorServie) { }

    resetDataDetailFunc() {
        this.resetDataDetail.emit();
    }

    //////////////////////////////////////////////////////////////////////////////////// ITEM
    newItemClick() {
        this.newItem.emit();
    }

    addNewItem(item: Item) {
        const body = JSON.stringify(item);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post('http://localhost:3000/set-data/insert-item' + token, body, { headers: headers })
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
        return this.http.get('http://localhost:3000/set-data/get-items' + token)
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

    deleteItem(item: Item) {
        this.items.splice(this.items.indexOf(item), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('http://localhost:3000/set-data/delete-item/' + item.itemId + token)
            .map((response: Response) => {
                this.resetDataDetail.emit();
                response.json();
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }


    //////////////////////////////////////////////////////////////////////////////////// DATA PART
    newDataPartClick(itemId: string) {
        this.newDataPart.emit(itemId);
    }

    newSetData(dataFramePart: DataFramePart) {
        this.newSetDataEmit.emit(dataFramePart);
    }

    addNewDataFramePart(dataFramePart: DataFramePart) {
        const body = JSON.stringify(dataFramePart);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post('http://localhost:3000/set-data/insert-data-frame-part' + token, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const dfp = new DataFramePart(
                    result.obj.key,
                    //result.obj.type,
                    result.obj.value,
                    result.obj.itemId,
                    result.obj.descFramePart,
                    result.obj._id
                )
                this.dataFrameParts.push(dfp);
                return result;
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
        return this.http.get('http://localhost:3000/set-data/get-data-frame-parts?itemId=' + itemId + token)
            .map((response: Response) => {
                const mongoDataFrameParts = response.json().obj;
                let newDataFrameParts: DataFramePart[] = [];
                for (let dataFramePart of mongoDataFrameParts) {
                    newDataFrameParts.push(new DataFramePart(
                        dataFramePart.key,
                        //dataFramePart.type,
                        dataFramePart.value,
                        dataFramePart.item._id,
                        dataFramePart.descFramePart,
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

    deleteDataFramePart(dataFramePart: DataFramePart) {
        this.dataFrameParts.splice(this.dataFrameParts.indexOf(dataFramePart), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('http://localhost:3000/set-data/delete-data-frame-part/' + dataFramePart.dataFramePartId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    newDataFrameValue(jsonObject) {
        const body = jsonObject;
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post('http://localhost:3000/set-data/insert-data-frame-value' + token, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch(
            (error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            }
            );
    }

    getDataFrameValue(dataFramePartId) {
        const token = localStorage.getItem('token')
            ? '&token=' + localStorage.getItem('token')
            : '';
        return this.http.get('http://localhost:3000/set-data/get-data-frame-value?dataFramePartId=' + dataFramePartId + token)
            .map((response: Response) => {
                const dataFrameValues = response.json().obj;
                return dataFrameValues;
            })
            .catch(
            (error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            }
            );
    }


}