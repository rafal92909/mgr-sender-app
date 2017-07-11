import { DataFramePart } from './../../../data-frame.model';
import { SetDataServie } from './../../set-data.service';
import { Item } from './../../../item.model';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'mgr-set-data-data-frame',
  templateUrl: './set-data-data-frame.component.html'
})

export class SetDataDataFrameComponent implements OnInit, OnChanges {
  @Input() item: Item;

  dataFrameParts: DataFramePart[];

  constructor(private setDataServie: SetDataServie) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.setDataServie.getDataFramePart(this.item.itemId).subscribe(
      (dataFrameParts: DataFramePart[]) => {
        this.dataFrameParts = dataFrameParts;
      }
    );
  }

  newDataPartClick() {
    this.setDataServie.newDataPartClick(this.item.itemId);
  }
}