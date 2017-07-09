import { Item } from './../item.model';
import { SendDataServie } from './send-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mgr-send-data',
  templateUrl: './send-data.component.html'
})
export class SendDataComponent implements OnInit {
  clickedItem: Item;

  constructor(private sendDataServie: SendDataServie) { }

  ngOnInit() {
    this.sendDataServie.resetDataDetail.subscribe(
      () => this.clickedItem = null      
    );
  }
}