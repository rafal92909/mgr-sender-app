import { Item } from './../../item.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mgr-send-data-detail',
  templateUrl: './send-data-detail.component.html'
})
export class SendDataDetailComponent implements OnInit {
  @Input() item: Item;
  constructor() { }

  ngOnInit() {
  }

}