import { Item } from './../item.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mgr-set-data',
  templateUrl: './set-data.component.html'
})
export class SetDataComponent implements OnInit {
  clickedItem: Item;

  constructor() { }

  ngOnInit() {
  
  }
}