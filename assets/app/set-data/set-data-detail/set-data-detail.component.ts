import { Item } from './../../item.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mgr-set-data-detail',
  templateUrl: './set-data-detail.component.html'
})
export class SetDataDetailComponent implements OnInit {
  @Input() item: Item;

  constructor() { }

  ngOnInit() {
  }

}