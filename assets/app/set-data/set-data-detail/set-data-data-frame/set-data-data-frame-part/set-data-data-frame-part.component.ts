import { DataFramePart } from './../data-frame.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mgr-set-data-data-frame-part',
  templateUrl: './set-data-data-frame-part.component.html'
})
export class SetDataDataFramePartComponent implements OnInit {
  @Input() dataFramePart: DataFramePart;
  constructor() { }

  ngOnInit() {
  }

  onEdit() {
    console.log('edit');
  }
  onDelete() {
    console.log('delete');
  }

}