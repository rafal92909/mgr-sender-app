import { DataFramePart } from './../data-frame.model';
import { SetDataServie } from './../../../set-data.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mgr-set-data-data-frame-form',
  templateUrl: './set-data-data-frame-form.component.html',
    styles: [`
        .backdrop {
            background-color: rgba(0,0,0,0.6);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 1;
        }
  `]
})
export class SetDataDataFrameFormComponent implements OnInit {
  myForm: FormGroup;
  display = 'none';
  itemId;
  constructor(private setDataServie: SetDataServie) { }

  onCloseClick() {
    this.display = 'none';
    this.myForm.reset();
  }

  onSubmit() {
    const dataFramePart = new DataFramePart(
      this.myForm.value.key,
      this.myForm.value.type,
      this.myForm.value.value,
      this.itemId,
      'dataFramePartID'
    );
    this.display = 'none';
    this.setDataServie.addNewDataFramePart(dataFramePart)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
    this.myForm.reset();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      key: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      value: new FormControl(null, Validators.required)
    });
    this.setDataServie.newDataPart.subscribe(
      (itemId) => {
        this.itemId = itemId;
        this.display = 'block'
      }
    );
  }
}