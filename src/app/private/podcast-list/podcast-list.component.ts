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
  constructor(public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) { }

  ngOnInit() {
    if (!this._localStorage.getUserData()) {
      this.router.navigate(['/', 'login'])
      return
    }
    if (this._localStorage.getUserData().approval_status != 'Approved') {
      // this.toaster.error('Your approval is pending.');
      return
    }
    this._podService.getPodcastList();
    this._podService.getStatisticsList();
    this._podService.getCategoryList();
    this._podService.getLanguageList();
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
    this._podService.deletedList = list;
    this._podService.isDelete = true;
  }

}
