import { SendDataServie } from './../../send-data.service';
import { Item } from './../../../item.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mgr-send-data-item',
  templateUrl: './send-data-item.component.html'
})
export class SendDataItemComponent implements OnInit {

  @Input() item: Item;
  @Output() itemClicked = new EventEmitter<void>();
  spanClass = "glyphicon glyphicon-play";
  constructor(private sendDataServie: SendDataServie) { }

  ngOnInit() {
  }

  onClick(event) {
    event.preventDefault();
    this.itemClicked.emit();
  }

  onGenerate(event) {
    event.preventDefault();
    if (this.item.il == null || this.item.il == false) {
      this.item.il = true;
    } else {
      this.item.il = false;
    }
    this.sendDataServie.generateFrames(this.item).subscribe(
      result => console.log(result)
    );
  }

}