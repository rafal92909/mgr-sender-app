import { Item } from './../../../item.model';
import { SendDataServie } from './../../send-data.service';
import { DataFramePart } from './../../../data-frame.model';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'mgr-send-data-data-frame',
  templateUrl: './send-data-data-frame.component.html'
})
export class SendDataDataFrameComponent implements OnInit, OnChanges {


  @Input() item: Item;

  dataFrameParts: DataFramePart[];

  constructor(private sendDataServie: SendDataServie) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.sendDataServie.getDataFramePart(this.item.itemId).subscribe(
      (dataFrameParts: DataFramePart[]) => {
        this.dataFrameParts = dataFrameParts;
      }
    );
  }

}