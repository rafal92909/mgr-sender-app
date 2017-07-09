import { SendDataServie } from './../send-data.service';
import { Item } from './../../item.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mgr-send-data-list',
  templateUrl: './send-data-list.component.html'
})
export class SendDataListComponent implements OnInit {
  @Output() itemClickedList = new EventEmitter<Item>();

  items: Item[] = [];


  constructor(private sendDataServie: SendDataServie) {
  }

  ngOnInit() {
    this.sendDataServie.getItems().subscribe(
      (items: Item[]) => {
        this.items = items
      }
    );
  }

  onItemClicked(item: Item) {
    this.itemClickedList.emit(item);
  }

}