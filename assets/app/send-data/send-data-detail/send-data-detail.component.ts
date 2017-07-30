import { ChatService } from './chat.service';
import { Item } from './../../item.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'mgr-send-data-detail',
  templateUrl: './send-data-detail.component.html'
})
export class SendDataDetailComponent implements OnInit {
  private messages = [];
  private connection;

    constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.unshift(message);
      //console.log(message);
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}