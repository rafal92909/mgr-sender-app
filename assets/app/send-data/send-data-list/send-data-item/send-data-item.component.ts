import { SendDataServie } from './../../send-data.service';
import { Item } from './../../../item.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mgr-send-data-item',
  templateUrl: './send-data-item.component.html'
})
export class SendDataItemComponent implements OnInit {

  @Input() item: Item;
  @Output() itemClicked = new EventEmitter<void>();
  constructor(private sendDataServie: SendDataServie) { }

  ngOnInit() {
  }

  onClick(event) {
    event.preventDefault();
    this.itemClicked.emit();
  }

}