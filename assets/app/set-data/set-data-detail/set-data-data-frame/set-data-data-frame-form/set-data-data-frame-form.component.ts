import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mgr-set-data-data-frame-form',
  templateUrl: './set-data-data-frame-form.component.html'
})
export class SetDataDataFrameFormComponent implements OnInit {
  myForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.myForm = new FormGroup({
      key: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      value: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    console.log('submit');
  }

}