import { SetDataServie } from './set-data.service';
import { Item } from './../item.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mgr-set-data',
  templateUrl: './set-data.component.html'
})
export class SetDataComponent implements OnInit {
  clickedItem: Item;

  constructor(private setDataServie: SetDataServie) { }

  ngOnInit() {
    this.setDataServie.resetDataDetail.subscribe(
      () => this.clickedItem = null      
    );
  }
}