import { Injectable } from '@angular/core';
import { LocalstorageService } from '../shared/services/localstorage.service';
import { WebService } from '../shared/services/web.service';

@Injectable({
  providedIn: 'root'
})
export class PorcastService {
  podcastListData: any;
  serachvalue: string = '';
  categoryList: any[] = [];
  languageList: any[] = [];
  noteList: any[] = [];
  RJDasboardList: any[] = [];
  RJDasboardList1: any[] = [];
  deletedList: any;
  NotificationList: any[] = [];
  isDelete: boolean = false;
  isProcessing: boolean = false;
  StatisticsList: any = {
    PendingTotal: 0,
    RejectedTotal: 0,
    ApprovedTotal: 0,
    LiveTotal: 0,
    CommentTotal: 0,
    UnreadNotificationCount: "0"
  };
  mobileNumber: number = 0;
  constructor(public _webService: WebService, public _localStorage: LocalstorageService) { }
  getCategoryList() {
    this._webService.commonMethod('category', '', "GET").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.categoryList = data.Response;
        }
      }
    )
  }
  getLanguageList() {
    this._webService.commonMethod('language', '', "GET").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.languageList = data.Response;
        }
      }
    )
  }

  getNodeList() {
    let req = {
      "podcast_id": this.podcastListData.id
    }
    this._webService.commonMethod('podcast/note/list', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.noteList = data.Response;
        }
      }
    )
  }

  searchList(data?:any) {
    let tempdata=data ? data : this.serachvalue;
    let temp = this.RJDasboardList1.filter(x => JSON.stringify(x).toLowerCase().includes(tempdata.toLowerCase()));
    this.RJDasboardList = temp;
    }

    getPodcastList() {
      this.isProcessing = true;
      let req = {
        "user_id": this._localStorage.getUserData().id,
        "podcast_id": ""
      }
      this._webService.commonMethod('podcast/list', req, "POST").subscribe(
        data => {
          if (data.Status == "Success" && data.Response && data.Response.length) {
            data.Response.forEach(data => {
              data.ispodcastDelete = false;
            });
            console.log(data.Response, "data.Response")
            this.RJDasboardList = data.Response;
            this.RJDasboardList1 = data.Response;
          }
          this.isProcessing = false;
        }
      )
    }
  
    getStatisticsList() {
      let req = {
        "user_id": this._localStorage.getUserData().id
      }
      this._webService.commonMethod('user/statistics', req, "POST").subscribe(
        data => {
          if (data.Status == 'Success' && data.Response && data.Response.length) {
            this.StatisticsList = data.Response[0];
            this.getNotificationLise();
          }
        }
      )
    }
  
getNotificationLise(){
  let req = {
      "user_id": this._localStorage.getUserData().id,
      "usertype":"RJ"
  }
  this._webService.commonMethod('user/notificationlist', req, "POST").subscribe(
    data => {
      if (data.Status == 'Success' && data.Response && data.Response.length) {
        this.NotificationList = data.Response;
      }
    }
  )
}

}
