import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mgr-set-data-desc-frame',
  templateUrl: './set-data-desc-frame.component.html'
})
export class SetDataDescFrameComponent implements OnInit {

  @Input() descFrameId: string;
  constructor() { }

  ngOnInit() {
  }

}