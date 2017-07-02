import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mgr-set-data-data-frame',
  templateUrl: './set-data-data-frame.component.html'
})
export class SetDataDataFrameComponent implements OnInit {
  @Input() dataFrameId: string;
  constructor() { }

  ngOnInit() {
  }

}