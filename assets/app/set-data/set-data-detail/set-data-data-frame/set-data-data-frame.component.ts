import { Item } from './../../../item.model';
import { DataFrame } from './data-frame.model';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'mgr-set-data-data-frame',
  templateUrl: './set-data-data-frame.component.html'
})
export class SetDataDataFrameComponent implements OnInit, OnChanges {
  // @Input() dataFrameId: string;
  // @Input() itemId: string;
  @Input() item: Item;

  dataFrames: DataFrame[];

  constructor() { }

  ngOnInit() {
  }


  ngOnChanges() {
    console.log(this.item.itemId);
    if (this.item.itemId === "Item id 1231") {
      this.dataFrames = [
        new DataFrame("loggerId", "string", "const", this.item.itemId, this.item.dataFrameId),
        new DataFrame("temperatures", "aDecimal", "interval", this.item.itemId, this.item.dataFrameId),
        new DataFrame("batteryVoltage", "decimal", "interval", this.item.itemId, this.item.dataFrameId),
        new DataFrame("measurmentTime", "date", "getDate", this.item.itemId, this.item.dataFrameId)
      ]
    } else {
      this.dataFrames = [
        new DataFrame("loggerId", "string", "const", this.item.itemId, this.item.dataFrameId)
      ]
    }
  }
  onEdit() {
    console.log('edit');
  }
  onDelete() {
    console.log('delete');
  }
}