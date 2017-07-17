import { SetDataServie } from './../../../set-data.service';
import { DataFramePart } from './../../../../data-frame.model';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
  elements: FormElements[] = [];
  dataFramePart: DataFramePart;
  display = 'none';
  showForm = true;
  fw = 600;

  constructor(private setDataServie: SetDataServie, private formBuilder: FormBuilder) { }

  onCloseClick() {
    this.display = 'none';
    this.myForm.reset();
  }

  showDialogWindow() {
    this.display = 'block';
  }
  // https://embed.plnkr.co/aWTZswhBnUVLg7qyDr83/
  ngOnInit() {
    this.myForm = new FormGroup({});

    this.setDataServie.newSetDataEmit.subscribe(
      (dataFramePart) => {
        this.showForm = true;
        this.elements = [];
        this.myForm = new FormGroup({});
        this.dataFramePart = dataFramePart;

        if (this.dataFramePart.value == "const") {
          this.myForm = new FormGroup({
            'value': new FormControl(null, Validators.required)
          });
          let formElement = new FormElements('value', 'Const value', 700);
          this.elements.push(formElement);
        }

        if (this.dataFramePart.value == "getdate") {
          this.showForm = false;
        }

        if (this.dataFramePart.value == "range") {
          this.myForm = new FormGroup({
            'valueMin': new FormControl(null, Validators.required),
            'valueMax': new FormControl(null, Validators.required),
            'randomInterval': new FormControl(null, Validators.required),
            'warningMin': new FormControl(null),
            'warningMax': new FormControl(null),
            'criticalMin': new FormControl(null),
            'criticalMax': new FormControl(null)
          });

          this.elements.push(
            new FormElements('valueMin', 'Minimum value', 700),
            new FormElements('valueMax', 'Maximum value', 700),
            new FormElements('randomInterval', 'Random interval', 700),
            new FormElements('warningMin', 'Minimum warning value', 300),
            new FormElements('warningMax', 'Maximum warning value', 300),
            new FormElements('criticalMin', 'Minimum critical value', 300),
            new FormElements('criticalMax', 'Maximum critical value', 300)
          );
          // if number - ile miejsc po przecinku (precision)
          // if value - opis
        }

        if (this.dataFramePart.value == "set") {
          this.myForm = new FormGroup({
            'values': new FormControl(null, Validators.required),
            'warningMin': new FormControl(null),
            'warningMax': new FormControl(null),
            'criticalMin': new FormControl(null),
            'criticalMax': new FormControl(null)
          });

          this.elements.push(
            new FormElements('values', 'Set of values (use comma as separator)', 700),
            new FormElements('warningMin', 'Minimum warning value', 300),
            new FormElements('warningMax', 'Maximum warning value', 300),
            new FormElements('criticalMin', 'Minimum critical value', 300),
            new FormElements('criticalMax', 'Maximum critical value', 300)
          );
        }

        this.showDialogWindow();
      }
    );

  }

  onSubmit() {
    let jsonString = "{ ";
    for (let element of this.elements) {
      if (this.myForm.controls[element.id].value == null) {
        jsonString += '"' + element.id + '" : null, ';
      } else {
        jsonString += '"' + element.id + '" : "' + this.myForm.controls[element.id].value + '", ';
      }
    }
    jsonString += '"dataFramePartId" : "' + this.dataFramePart.dataFramePartId + '" }';
    console.log(jsonString);
    this.setDataServie.newDataFrameValue(jsonString).subscribe(
      result => {
        console.log(result);
        this.onCloseClick(); 
      }
    );

  }


}


export class FormElements {
  constructor(
    public id: string,
    public label: string,
    public fontWeight: number) { }
}