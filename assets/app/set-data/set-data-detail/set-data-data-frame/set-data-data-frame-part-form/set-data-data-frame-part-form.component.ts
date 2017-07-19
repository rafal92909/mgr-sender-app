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

  constructor(private setDataServie: SetDataServie, private formBuilder: FormBuilder) { }

  onCloseClick() {
    this.display = 'none';
    this.myForm.reset();
  }

  showDialogWindow() {
    this.display = 'block';
  }

  ngOnInit() {
    this.myForm = new FormGroup({});

    this.setDataServie.newSetDataEmit.subscribe(
      (dataFramePart) => {
        this.setDataServie.getDataFrameValue(dataFramePart.dataFramePartId).subscribe(
          (jsonObject: string) => {

            this.showForm = true;
            this.elements = [];
            this.myForm = new FormGroup({});
            this.dataFramePart = dataFramePart;

            if (this.dataFramePart.value == "const") {

              let desc = null;
              let value = null;
              if (jsonObject != null) {
                if (jsonObject.hasOwnProperty('desc')) {
                  desc = jsonObject['desc'];
                }
                if (jsonObject.hasOwnProperty('value')) {
                  value = jsonObject['value'];
                }
              }
              if (this.dataFramePart.descFramePart == 'value') {
                this.myForm = new FormGroup({
                  'desc': new FormControl(desc, Validators.required),
                  'value': new FormControl(value, Validators.required)
                });
                this.elements.push(
                  new FormElements('desc', 'Description', 700, 'text'),
                  new FormElements('value', 'Const value', 700, 'text')
                );
              } else {
                this.myForm = new FormGroup({
                  'value': new FormControl(value, Validators.required)
                });
                this.elements.push(new FormElements('value', 'Const value', 700, 'text'));
              }

            }

            if (this.dataFramePart.value == "getdate") {
              this.showForm = false;
            }

            if (this.dataFramePart.value == "range") {
              let desc = null;
              let valueMin = null;
              let valueMax = null;
              let precision = null;
              let randomInterval = null;
              let warningMin = null;
              let warningMax = null;
              let criticalMin = null;
              let criticalMax = null;

              if (jsonObject != null) {
                if (jsonObject.hasOwnProperty('desc')) {
                  desc = jsonObject['desc'];
                }
                if (jsonObject.hasOwnProperty('valueMin')) {
                  valueMin = jsonObject['valueMin'];
                }
                if (jsonObject.hasOwnProperty('valueMax')) {
                  valueMax = jsonObject['valueMax'];
                }
                if (jsonObject.hasOwnProperty('precision')) {
                  precision = jsonObject['precision'];
                }
                if (jsonObject.hasOwnProperty('precision')) {
                  randomInterval = jsonObject['precision'];
                }
                if (jsonObject.hasOwnProperty('randomInterval')) {
                  randomInterval = jsonObject['randomInterval'];
                }
                if (jsonObject.hasOwnProperty('warningMin')) {
                  warningMin = jsonObject['warningMin'];
                }
                if (jsonObject.hasOwnProperty('warningMax')) {
                  warningMax = jsonObject['warningMax'];
                }
                if (jsonObject.hasOwnProperty('criticalMin')) {
                  criticalMin = jsonObject['criticalMin'];
                }
                if (jsonObject.hasOwnProperty('criticalMax')) {
                  criticalMax = jsonObject['criticalMax'];
                }
              }
              this.elements.push(
                new FormElements('valueMin', 'Minimum value', 700, 'number'),
                new FormElements('valueMax', 'Maximum value', 700, 'number'),
                new FormElements('precision', 'Precisin', 700, 'number'),
                new FormElements('randomInterval', 'Random interval', 700, 'number'),
                new FormElements('warningMin', 'Minimum warning value', 300, 'number'),
                new FormElements('warningMax', 'Maximum warning value', 300, 'number'),
                new FormElements('criticalMin', 'Minimum critical value', 300, 'number'),
                new FormElements('criticalMax', 'Maximum critical value', 300, 'number')
              );
              if (this.dataFramePart.descFramePart == 'value') {
                this.elements.unshift(new FormElements('desc', 'Description', 300, 'text'));

                this.myForm = new FormGroup({
                  'desc': new FormControl(desc, Validators.required),
                  'valueMin': new FormControl(valueMin, Validators.required),
                  'valueMax': new FormControl(valueMax, Validators.required),
                  'precision': new FormControl(precision, Validators.required),
                  'randomInterval': new FormControl(randomInterval, Validators.required),
                  'warningMin': new FormControl(warningMin),
                  'warningMax': new FormControl(warningMax),
                  'criticalMin': new FormControl(criticalMin),
                  'criticalMax': new FormControl(criticalMax)
                });
              } else {
                this.myForm = new FormGroup({
                  'valueMin': new FormControl(valueMin, Validators.required),
                  'valueMax': new FormControl(valueMax, Validators.required),
                  'precision': new FormControl(precision, Validators.required),
                  'randomInterval': new FormControl(randomInterval, Validators.required),
                  'warningMin': new FormControl(warningMin),
                  'warningMax': new FormControl(warningMax),
                  'criticalMin': new FormControl(criticalMin),
                  'criticalMax': new FormControl(criticalMax)
                });
              }              
            }

            if (this.dataFramePart.value == "set") {
              let desc = null;
              let values = null;
              let warningMin = null;
              let warningMax = null;
              let criticalMin = null;
              let criticalMax = null;
              if (jsonObject != null) {
                values = '';
                for (let key in Object.keys(jsonObject)) {
                  if (Object.keys(jsonObject)[key].startsWith('value')) {
                    values = ', ' + jsonObject[Object.keys(jsonObject)[key]] + values;
                  }
                }

                if (values.length == 0) {
                  values = null
                } else {
                  values = values.substr(2);
                }
                if (jsonObject.hasOwnProperty('desc')) {
                  desc = jsonObject['desc'];
                }
                if (jsonObject.hasOwnProperty('warningMin')) {
                  warningMin = jsonObject['warningMin'];
                }
                if (jsonObject.hasOwnProperty('warningMax')) {
                  warningMax = jsonObject['warningMax'];
                }
                if (jsonObject.hasOwnProperty('criticalMin')) {
                  criticalMin = jsonObject['criticalMin'];
                }
                if (jsonObject.hasOwnProperty('criticalMax')) {
                  criticalMax = jsonObject['criticalMax'];
                }
              }

              this.elements.push(
                new FormElements('values', 'Set of values (use comma as separator)', 700, 'text'),
                new FormElements('warningMin', 'Minimum warning value', 300, 'text'),
                new FormElements('warningMax', 'Maximum warning value', 300, 'text'),
                new FormElements('criticalMin', 'Minimum critical value', 300, 'text'),
                new FormElements('criticalMax', 'Maximum critical value', 300, 'text')
              );

              if (this.dataFramePart.descFramePart == 'value') {
                this.elements.unshift(new FormElements('desc', 'Description', 300, 'text'));

                this.myForm = new FormGroup({
                  'desc': new FormControl(desc, Validators.required),
                  'values': new FormControl(values, Validators.required),
                  'warningMin': new FormControl(warningMin),
                  'warningMax': new FormControl(warningMax),
                  'criticalMin': new FormControl(criticalMin),
                  'criticalMax': new FormControl(criticalMax)
                });

              } else {
                this.myForm = new FormGroup({
                  'values': new FormControl(values, Validators.required),
                  'warningMin': new FormControl(warningMin),
                  'warningMax': new FormControl(warningMax),
                  'criticalMin': new FormControl(criticalMin),
                  'criticalMax': new FormControl(criticalMax)
                });

              }
            }

            this.showDialogWindow();
          }
        );
      }
    );
  }

  onSubmit() {
    let jsonString = '{ ';

    for (let element of this.elements) {
      if (this.dataFramePart.value == "set" && element.id == "values") {
        let values = this.myForm.controls[element.id].value;
        values = values.split(",").map(function (item) {
          return item.trim();
        });
        values = values.filter(this.onlyUnique);
        for (let i = 0; i < values.length; i++) {
          if (values[i] != null && values[i].length > 0) {
            jsonString += '"value' + i + '" : "' + values[i] + '", ';
          }
        }
      } else {
        if (this.myForm.controls[element.id].value == null) {
          jsonString += '"' + element.id + '" : null, ';
        } else {
          jsonString += '"' + element.id + '" : "' + this.myForm.controls[element.id].value + '", ';
        }
      }
    }
    jsonString += '"dataFramePartId" : "' + this.dataFramePart.dataFramePartId + '" }';

    this.setDataServie.newDataFrameValue(jsonString).subscribe(
      result => {
        //console.log(result);
        this.onCloseClick();
      }
    );
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}



export class FormElements {
  constructor(
    public id: string,
    public label: string,
    public fontWeight: number,
    public type: string) { }
}