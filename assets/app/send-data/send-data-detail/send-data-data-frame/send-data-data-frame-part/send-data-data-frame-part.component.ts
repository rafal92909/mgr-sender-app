import { DataFramePart } from './../../../../data-frame.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mgr-send-data-data-frame-part',
  templateUrl: './send-data-data-frame-part.component.html'
})
export class SendDataDataFramePartComponent implements OnInit {
  @Input() dataFramePart: DataFramePart;
  constructor() { }

  ngOnInit() {
  }

}