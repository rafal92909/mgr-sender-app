import { Item } from './../../../item.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mgr-set-data-item',
  templateUrl: './set-data-item.component.html'
})
export class SetDataItemComponent implements OnInit {

  @Input() item: Item;  
  @Output() itemClicked = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.itemClicked.emit();
  }

}