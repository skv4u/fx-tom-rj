import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/services/toast.service';
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

  refreshObject:any;
  constructor(public _webService: WebService, public podcastService: PorcastService, public commonService: CommonService, public toaster: ToastService, private route:Router) { }

  ngOnInit() {
    this.getUserList();
    this.startAutoRefresh()
  }
  ngOnDestroy(){
    console.log("timer stopped")
    clearInterval(this.refreshObject);
  }
  startAutoRefresh(){
    this.refreshObject = setInterval(()=>{
      this.getUserList();
      if(this.selectedData.sender_id && this.selectedData.sender_id != ""){
        this.getmessageList();
      }
    },5000);
  }
  redirctDashboard(){
    clearInterval(this.refreshObject);
    this.route.navigate(['/dashboard']);
  }
  loadChatforUser(elem: any) {
    for (let a of this.userList) {
      a.active = false;
    }
    elem.active = true;
    this.selectedData = elem;
    this.selectedData.unread_count = 0;
    this.selectedData.profile_image = this.selectedData.profile_image || './assets/images/nopicuser.png';
    this.isUserSelected = true;
    this.getmessageList();
    this.updatecounterList();
  }

  createMessage(msg?: string) {
    msg = msg || this.Message
    if (msg.trim().length == 0) {
      return
    }
    this.messagelist.push({
      "sender_id": this.podcastService.localStorageData.id,
      "sender_type": "RJ",
      "name": this.podcastService.localStorageData.fullname,
      "message": msg,
      "created_date": this.commonService.formatDate(new Date(), 'dd-mmm-yy', '-', true)
    })

    let req = {
      "sender_id": this.podcastService.localStorageData.id,
      "sender_type": "RJ",
      "receiver_id": this.selectedData.sender_id,
      "receiver_type": "Mobuser",
      "message": msg
    }
    this._webService.commonMethod('chat/create', req, "POST").subscribe(
      data => {
        this.Message = '';
        this.getmessageList();
        this.getUserList();
      })
  }

  getUserList() {
    let req = {
      "user_id": this.podcastService.localStorageData.id
    }
    this._webService.commonMethod('chat/user/list', req, "POST").subscribe(
      data => {
        for (let a of data.Response) {
          a.active = this.selectedData && this.selectedData.sender_id && a.sender_id == this.selectedData.sender_id;
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
        setTimeout( ()=> {
          document.getElementById('scroll').scrollTop = document.getElementById('scroll').scrollHeight;
        },100)
      })
  }

  updatecounterList(){
    let req = {
      "user_id": this.podcastService.localStorageData.id,
      "sender_id": this.selectedData.sender_id
    }
    this._webService.commonMethod('chat/user/countupdate', req, "PUT").subscribe(
      data => {
       
      })
  }

  uploadFile(element) {
    const file = element[0];
    if (!(file.type.indexOf('audio') != -1 || file.type.indexOf('image') != -1)) {
      this.toaster.error("Invalid file");
      return
    }
    this.podcastService.loader = true;
    this.podcastService.loaderMessage = "Uploading...";
    console.log(file, "file");
    if (file == undefined) return;
    // console.log(file, "element");
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this._webService.UploadDocument1("s3bucket/upload", formData).
      subscribe((data: any) => {
        if (data.type === HttpEventType.Response) {
          // this.Message = data.body.Response;
          this.podcastService.loader = false;
          this.podcastService.loaderMessage = "Loading...";
          this.sendAttachment(data.body.Response, file.type);
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.podcastService.loaderMessage = " Uploading : " + percentDone + "%";
        }
      }, err => {
        this.podcastService.loader = false;
        this.Message = "";
        this.podcastService.loaderMessage = "Loading...";
      });
  }

  sendAttachment(fileName: string, filetype: string) {
    let tag = '';
    if (filetype.indexOf('audio') != -1) {
      tag = `<audio controls preload="auto">
        <source src="${fileName}" type="audio/mpeg">
        <source src="${fileName}" type="audio/ogg">
        Your browser does not support the audio element.
    </audio>`;
    }
    else if (filetype.indexOf('image') != -1) {
      tag = `<img src="${fileName}" alt="${fileName}" style="max-height: 100px;max-width: 147px;">`;
    }
    if (tag != '')
      this.createMessage(tag);
  }


}
