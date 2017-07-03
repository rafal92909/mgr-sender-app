import { SetDataServie } from './../set-data.service';
import { EventEmitter } from '@angular/core';
import { Item } from './../../item.model';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mgr-set-data-list',
  templateUrl: './set-data-list.component.html'
})
export class SetDataListComponent implements OnInit {
  @Output() itemClickedList = new EventEmitter<Item>();

  items: Item[] = [];


  constructor(private setDataServie: SetDataServie) {
  }

  ngOnInit() {
    this.setDataServie.getItems().subscribe(
      (items: Item[]) => {
        this.items = items
      }
    );
  }

  onItemClicked(item: Item) {
    this.itemClickedList.emit(item);
  }

  onNewItemClick() {
    this.setDataServie.newItemClick();
  }
}