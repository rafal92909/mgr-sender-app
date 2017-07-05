import { SetDataServie } from './../../../set-data.service';
import { DataFramePart } from './../data-frame.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mgr-set-data-data-frame-part',
  templateUrl: './set-data-data-frame-part.component.html'
})
export class SetDataDataFramePartComponent implements OnInit {
  @Input() dataFramePart: DataFramePart;
  constructor(private setDataServie: SetDataServie) { }

  ngOnInit() {
  }

  // onEdit() {
  //   console.log('edit');
  // }
  onDelete() {
    this.setDataServie.deleteDataFramePart(this.dataFramePart).subscribe(
      result => console.log(result)
    );
  }

}