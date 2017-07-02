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
    new Item('name', 'description', "null 123", "null 1235"),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null),
    new Item('name', 'description', null, null),
    new Item('name 2', 'description 2', null, null),
    new Item('name 3', 'description 3', null, null)
  ];
  

  constructor() {
  }

  ngOnInit() {
  }

  onItemClicked(item: Item) {
    this.itemClickedList.emit(item);
  }

}