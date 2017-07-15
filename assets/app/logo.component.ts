import { Component } from '@angular/core';

@Component({
    selector: 'mgr-logo',
    templateUrl: './logo.component.html'
})
export class LogoComponent {  
    imgPath: string;

    constructor() {
        //this.imgPath = "https://cdn.pixabay.com/photo/2015/11/03/09/03/at-1019990_960_720.jpg";
        this.imgPath = "http://image.ibb.co/iDT37v/sender_small.jpg";
    }
}