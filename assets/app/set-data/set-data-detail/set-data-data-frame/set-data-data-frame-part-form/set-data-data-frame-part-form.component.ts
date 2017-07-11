import { SetDataServie } from './../../../set-data.service';
import { DataFramePart } from './../../../../data-frame.model';
import { Component, OnInit, Input, ViewChild, ElementRef  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
  dataFramePart: DataFramePart;
  display = 'none';
  html = '';  
  @ViewChild('dataContainer') dataContainer: ElementRef;

  constructor(private setDataServie: SetDataServie) {}

  onCloseClick() {
    this.display = 'none';
  }
  // https://embed.plnkr.co/aWTZswhBnUVLg7qyDr83/
  ngOnInit() {
    // this.myForm = new FormGroup({
    //   name: new FormControl(null, Validators.required),
    //   desc: new FormControl(null, Validators.required)
    // });
    
    this.setDataServie.newSetDataEmit.subscribe(
      (dataFramePart) => {
        this.dataFramePart = dataFramePart;
        this.display = 'block';        
        this.html = '<input type="text" id="desc" class="form-control" formControlName="desc" #i><button class="btn btn-primary" type="submit" (click)="onSubmit(i)">Submit</button>';
        this.dataContainer.nativeElement.innerHTML = this.html;
        //document.getElementById("formId").innerHTML = this.html;
      }
    );

  }

  onSubmit(form) {
    console.log(form);
    this.onCloseClick();
  }


}