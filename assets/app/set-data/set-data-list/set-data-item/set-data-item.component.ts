import { SetDataServie } from './../../set-data.service';
import { Item } from './../../../item.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mgr-set-data-item',
  templateUrl: './set-data-item.component.html'
})
export class SetDataItemComponent implements OnInit {

  @Input() item: Item;  
  @Output() itemClicked = new EventEmitter<void>();
  constructor(private setDataServie: SetDataServie) { }

  ngOnInit() {
  }

  onClick(event) {
    event.preventDefault();
    this.itemClicked.emit();
  }

  onDelete(event) {
    event.preventDefault();
    this.setDataServie.deleteItem(this.item).subscribe(
      result => console.log(result)
    );
  }
}