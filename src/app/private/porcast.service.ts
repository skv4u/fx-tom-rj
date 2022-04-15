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
    SubscribedTotal: 0,
    rj_rating: 0,
    ChatCountTotal: 0
  };
  localStorageData: any = {}

  filterApplied: boolean = false;
  showComments: boolean = false;
  iscreatebuttonVisiable: boolean = true;
  // Approval_Status: string = this.localStorageData.approval_status;
  podcastFilterList: any = {
    isTittle: true,
    iscategory: true,
    isupdatedate: false,
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
  private cancelClick: Function;
  iscommentpage: boolean = false;
  showList: any[] = [];
  NotificationLoader: boolean = false;
  constructor(public _webService: WebService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) {
    // if(this.localStorageData && Object.keys(this.localStorageData).length == 0){
    //   this.localStorageData = this.localStorageData;
    //  // this.Approval_Status = this.localStorageData.approval_status;
    // }
    // this.getCategoryList();
    // this.getLanguageList();
  }
  getCategoryList() {
    this.categoryList = [];
    this._webService.commonMethod('category', '', "GET").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.categoryList = data.Response;
        }
      },
      err => {
        // console.log(err);
        if (err.status === 401) {
          localStorage.removeItem('rjttptoken');
          alert("Token expired!, Reloading the page");
          window.location.reload();
        }
      }
    )
  }
  getLanguageList() {
    this.languageList = [];
    this._webService.commonMethod('language', '', "GET").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.languageList = data.Response;
        }
      }
    )
  }

  getshowList() {
    this.showList = [];
    this._webService.commonMethod('user/shows/' + this.localStorageData.id, '', "GET").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.showList = data.Response;
        }
      }
    )
  }


  getNodeList() {
    this.noteList = [];
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
    // let temp = this.RJDasboardList1.filter(x => JSON.stringify(x).toLowerCase().includes(tempdata.toLowerCase()));
    let temp = this.RJDasboardList1.filter(x => Object.values(x).join("").toLowerCase().includes(tempdata.toLowerCase()));
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
    this.RJDasboardList = [];
    this.RJDasboardList1 = [];
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
    this.StatisticsList = {
      PendingTotal: 0,
      RejectedTotal: 0,
      ApprovedTotal: 0,
      LiveTotal: 0,
      CommentTotal: 0,
      ModifyTotal: 0,
      UnreadNotificationCount: 0,
      BroadcastTotal: 0,
      PodcastTotal: 0,
      SubscribedTotal: 0,
      rj_rating: 0,
      ChatCountTotal: 0
    }
    let req = {
      "user_id": this.localStorageData.id
    }
    this._webService.commonMethod('user/statistics', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.StatisticsList = data.Response[0];
          // this.getNotificationLise();
        }
      }
    )
  }

  getNotificationLise() {
    this.NotificationList = [];
    this.NotificationLoader = true;
    let req = {
      "user_id": this.localStorageData.id,
      "usertype": "RJ"
    }
    this._webService.commonMethod('user/notificationlist', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.NotificationList = data.Response;
          this.NotificationLoader = false;
        }
      }
    )
  }
  viewDetails() {
    this.resetAllValues();
    if (this.localStorageData.approval_status == 'Pending') {
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
          this.router.navigate(['/', 'edit-profile'])
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
    this.NotificationList = [];
  }

  handleClick($event: any) {
    console.log("unbind")
    let target = $event.target.classList.contains('outsideclick') ||
      $event.target.parentNode.classList.contains('outsideclick')
    if (target || target == null) return;
    this.resetAllValues();
    this.cancelClick();
  }

  bindSingleClickEvent(render) {
    if (this.cancelClick) this.cancelClick();
    this.cancelClick = render.listen('document', 'click',
      ($event: any) => this.handleClick($event));
  }

  LogOut() {
    this.resetAllValues();
    // localStorage.clear();
    this.AllfilterValues = {
      issettingOpen: false,
      ShowFilter: false,
      showBell: false,
      iscategoryOpen: false,
      isStatusOpen: false
    }
    this.StatisticsList = {
      PendingTotal: 0,
      RejectedTotal: 0,
      ApprovedTotal: 0,
      LiveTotal: 0,
      CommentTotal: 0,
      ModifyTotal: 0,
      UnreadNotificationCount: 0,
      BroadcastTotal: 0,
      PodcastTotal: 0,
      SubscribedTotal: 0,
      rj_rating: 0,
      ChatCountTotal: 0
    }
    this.RJDasboardList = [];
    localStorage.removeItem('user_data');
    //localStorage.removeItem('tomtomtoken');
    this.router.navigate(['/', 'login'])
  }

}
