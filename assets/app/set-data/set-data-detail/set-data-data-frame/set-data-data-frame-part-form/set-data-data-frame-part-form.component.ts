import { SetDataServie } from './../../../set-data.service';
import { DataFramePart } from './../../../../data-frame.model';
import { Component, OnInit, Input, ViewChild, ElementRef  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'mgr-set-data-data-frame-part-form',
  templateUrl: './set-data-data-frame-part-form.component.html',
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
export class SetDataDataFramePartFormComponent implements OnInit {
  myForm: FormGroup;
  elements = [];
  dataFramePart: DataFramePart;
  display = 'none';

  constructor(private setDataServie: SetDataServie, private formBuilder: FormBuilder) { }

  onCloseClick() {
    this.display = 'none';
    this.myForm.reset();
  }
  // https://embed.plnkr.co/aWTZswhBnUVLg7qyDr83/
  ngOnInit() {
    this.myForm = new FormGroup({ });        
    
    this.setDataServie.newSetDataEmit.subscribe(
      (dataFramePart) => {
        this.elements = [];
        this.myForm = new FormGroup({ });        
        this.dataFramePart = dataFramePart;
        this.display = 'block';
      }
    );

  }  

  addAddress() {
    this.elements.push('name');
    this.elements.push('myNewControl');    
    this.myForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        myNewControl: new FormControl(null, Validators.required)
    });  
  }

  onSubmit() {
    for(let element of this.elements) {
      console.log(element + ': ' + this.myForm.controls[element].value);
    }    
     this.onCloseClick();    
  }


}