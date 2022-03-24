import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../shared/services/localstorage.service';
import { ToastService } from '../shared/services/toast.service';
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
  // isProcessing: boolean = false;
  isListPage: boolean = false;
  StatisticsList: any = {
    PendingTotal: 0,
    RejectedTotal: 0,
    ApprovedTotal: 0,
    LiveTotal: 0,
    CommentTotal: 0,
    ModifyTotal: 0,
    UnreadNotificationCount: 0,
    BroadcastTotal: 0,
    PodcastTotal: 0,
    SubscribedTotal: 0
  };
  localStorageData: any = {}

  filterApplied: boolean = false;
  // Approval_Status: string = this.localStorageData.approval_status;
  podcastFilterList: any = {
    isTittle: true,
    iscategory: true,
    isupdatedate: true,
    isstatus: true,
    isbroadcast: true,
    iscommits: true,
    isedit: true,
    islistdelete: true,
    isnote: true
  }
  AllfilterValues: any = {
    issettingOpen: false,
    ShowFilter: false,
    showBell: false,
    iscategoryOpen: false,
    isStatusOpen: false
  }
  mobileNumber: number = 0;
  loader: boolean = false;
  loaderMessage: string = "Loading...";
  constructor(public _webService: WebService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) {
    // if(this.localStorageData && Object.keys(this.localStorageData).length == 0){
    //   this.localStorageData = this.localStorageData;
    //  // this.Approval_Status = this.localStorageData.approval_status;
    // }
    // this.getCategoryList();
    // this.getLanguageList();
  }
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

  searchList(data?: any) {
    this.filterApplied = true;
    let tempdata = data ? data : this.serachvalue;
    let temp = this.RJDasboardList1.filter(x => JSON.stringify(x).toLowerCase().includes(tempdata.toLowerCase()));
    this.RJDasboardList = temp;
  }

  NotificationsearchList(data) {
    this.filterApplied = true;
    let tempdata = data ? data : this.serachvalue;
    let temp = this.RJDasboardList1.filter(x => JSON.stringify(x.id).toLowerCase().includes(tempdata.toLowerCase()));
    this.RJDasboardList = temp;
  }


  resetValues() {
    if (this.localStorageData.approval_status == 'Pending' || this.localStorageData.approval_status == 'Rejected') {
      return
    }
    this.resetAllValues();
    this.getPodcastList();
  }

  getPodcastList() {
    this.loader = true;
    let req = {
      "user_id": this.localStorageData.id,
      "podcast_id": ""
    }
    this._webService.commonMethod('podcast/list', req, "POST").subscribe(
      data => {
        if (data.Status == "Success" && data.Response && data.Response.length) {
          data.Response.forEach(data => {
            data.ispodcastDelete = false;
          });
          this.RJDasboardList = data.Response;
          this.RJDasboardList1 = data.Response;
          this.getStatisticsList();
          // this.viewDetails();
        }
        this.loader = false;
      }
    )
  }

  getStatisticsList() {
    let req = {
      "user_id": this.localStorageData.id
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

  getNotificationLise() {
    let req = {
      "user_id": this.localStorageData.id,
      "usertype": "RJ"
    }
    this._webService.commonMethod('user/notificationlist', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.NotificationList = data.Response;
        }
      }
    )
  }
  viewDetails() { 
    this.resetAllValues();
    if(this.localStorageData.approval_status == 'Pending'){
    this.toaster.error('Your approval is pending.')
    // this.router.navigate(['/', 'dashboard'])
    return
  }
  if (this.localStorageData.approval_status == 'Rejected') {
    this.toaster.error('Please contact Admin');
    // this.router.navigate(['/', 'dashboard'])
    return
  }
    this.loader = true;
    this._webService.commonMethod('user/view/' + this.localStorageData.id, '', "GET").subscribe(
      data => {
        this.loader = false;
        if (data.Status == 'Success' && data.Response) {
          this.localStorageData = data.Response;
          this._localStorage.setUserData(data.Response)
          this.router.navigate(['/','edit-profile'])
        }
      }
    )
  }

  resetAllValues() {
    this.filterApplied = false;
    this.serachvalue = '';
    this.AllfilterValues = {
      issettingOpen: false,
      ShowFilter: false,
      showBell: false,
      iscategoryOpen: false,
      isStatusOpen: false
    }
  }
}
