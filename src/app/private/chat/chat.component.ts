import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  isUserSelected: boolean = false;
  search: string = "";
  Message: any = '';
  userList: any[] = [];
  messagelist: any[] = [];
  selectedData: any = {};
  constructor(public _webService: WebService, public podcastService: PorcastService, public commonService: CommonService) { }

  ngOnInit() {
    this.getUserList();
  }
  loadChatforUser(elem: any) {
    for(let a of this.userList){
      a.active = false;
    }
    elem.active = true;
    this.selectedData = elem;
    this.selectedData.profile_image = this.selectedData.profile_image || './assets/images/nopicuser.png';
    this.isUserSelected = true;
    this.getmessageList();
  }

  createMessage() {
    if (this.Message.trim().length == 0) {
      return
    }
     this.messagelist.push({
      "sender_id": this.podcastService.localStorageData.id,
      "sender_type": "RJ",
      "name": this.podcastService.localStorageData.fullname,
      "message": this.Message,
      "created_date": this.commonService.formatDate(new Date(),'dd-mmm-yy','-',true)
  })

    let req = {
      "sender_id": this.podcastService.localStorageData.id,
      "sender_type": "RJ",
      "receiver_id": this.selectedData.sender_id,
      "receiver_type": "Mobuser",
      "message": this.Message
    }
    this._webService.commonMethod('chat/create', req, "POST").subscribe(
      data => {
        this.Message = '';
        this.getmessageList();
      })
  }

  getUserList() {
    let req = {
      "user_id": this.podcastService.localStorageData.id
    }
    this._webService.commonMethod('chat/user/list', req, "POST").subscribe(
      data => {
        for (let a of data.Response) {
          a.active = false;
        }
        this.userList = data.Response;
      })
  }
  getmessageList() {
    let req = {
      "user_id": this.podcastService.localStorageData.id,
      "sender_id": this.selectedData.sender_id
    }
    this._webService.commonMethod('chat/message/list', req, "POST").subscribe(
      data => {
        this.messagelist = data.Response;
      })
  }
}
