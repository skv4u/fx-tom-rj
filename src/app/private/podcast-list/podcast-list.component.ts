import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit {


  issettingOpen: boolean = false;
  iscategoryOpen: boolean = false;
  isProcessing: boolean = false;
  isDelete: boolean = false;
  isStatusOpen: boolean = false;
  isProgressing: boolean = false;
  constructor(public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) { }

  ngOnInit() {
    this._podService.isListPage = true;
    if (!this._localStorage.getUserData()) {
      this.router.navigate(['/', 'login'])
      return
    }
    if (this._localStorage.getUserData().approval_status == 'Pending' || this._localStorage.getUserData().approval_status == 'Rejected') {
      this.viewUser(() => {
        this.genericCall();
      });
    } else {
      this.genericCall();
    }
  }

  genericCall() {
    if (this._localStorage.getUserData().approval_status == 'Approved') {
    this._podService.getPodcastList();
    this._podService.getStatisticsList();
    this._podService.getCategoryList();
    this._podService.getLanguageList();
    }
  }


  viewUser(callback) {
    this.isProgressing = true;
    let req = {
      "username": this._localStorage.getUserData().username
    }
    this._webService.commonMethod('user/view', req, "POST").subscribe(
      data => {
        this.isProgressing = false;
        if (data.Status == 'Success' && data.Response) {
          this._localStorage.setUserData(data.Response);
          callback();
        }
      }
    )

  }


  LogOut() {
    localStorage.clear();
    this.router.navigate(['/', 'logout'])
  }
  getlistFilter() {

  }
  gotopodcasters(list) {
    this._podService.podcastListData = list;
    this.router.navigate(['/', 'about-podcast'])
  }




  deletepopup(list) {
    if (list.approvals == 'Live') {
      this.toaster.error("Podcast has been live now");
      return
    }
    if (this._localStorage.getUserData().approval_status == 'Rejected') {
      this.toaster.error('Please contact Admin')
      return
    }
    this._podService.deletedList = list;
    this._podService.isDelete = true;
  }

}
