import { EventEmitter } from '@angular/core';
import { Item } from './../../item.model';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mgr-set-data-list',
  templateUrl: './set-data-list.component.html'
})
export class SetDataListComponent implements OnInit {
  @Output() itemClickedList = new EventEmitter<Item>();

  items: Item[] = [
    new Item('name 1', 'description 1', "Item id 1231", "null 123", "null 1235"),
    new Item('name 2', 'description 2', "Item id 1232", null, null),
    new Item('name 3', 'description 3', "Item id 1233", null, null),
    new Item('name 4', 'description 4', "Item id 1234", null, null),
    new Item('name 5', 'description 5', "Item id 1235", null, null),
    new Item('name 6', 'description 6', "Item id 1236", null, null),
    new Item('name 7', 'description 7', "Item id 1237", null, null)
  ];
  

  constructor() {
  }

  ngOnInit() {
  }

  onItemClicked(item: Item) {
    this.itemClickedList.emit(item);    
  }

}