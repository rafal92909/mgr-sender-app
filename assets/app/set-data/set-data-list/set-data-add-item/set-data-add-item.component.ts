import { Item } from './../../../item.model';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SetDataServie } from './../../set-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mgr-set-data-add-item',
  templateUrl: './set-data-add-item.component.html',
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
export class SetDataAddItemComponent implements OnInit {
  display = 'none';
  myForm: FormGroup;

  constructor(private setDataServie: SetDataServie) { }

  onCloseClick() {
    this.display = 'none';
    this.myForm.reset();
  }

  onSubmit() {
    const item = new Item(
      this.myForm.value.name,
      this.myForm.value.desc,
      'newItemId'
    );
    this.display = 'none';
    this.setDataServie.addNewItem(item)
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
    this.myForm.reset();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      desc: new FormControl(null, Validators.required)
    });
    this.setDataServie.newItem.subscribe(
      () => this.display = 'block'
    );
  }
}

