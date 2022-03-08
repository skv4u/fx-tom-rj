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
  StatisticsList: any ={
    PendingTotal: 0,
    RejectedTotal: 0,
    ApprovedTotal: 0,
    LiveTotal: 0,
    CommentTotal: 0,
  };
  isStatusOpen: boolean = false;
  constructor(public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) { }

  ngOnInit() {
    if(!this._localStorage.getUserData()){
    this.router.navigate(['/','login'])
    return
  }
  if(this._localStorage.getUserData().approval_status != 'Approved'){
   // this.toaster.error('Your approval is pending.');
    return
  }
    this.getPodcastList();
    this.getStatisticsList();
    this._podService.getCategoryList();
    this._podService.getLanguageList();
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
          this._podService.RJDasboardList = data.Response;
          this._podService.RJDasboardList1 = data.Response;
        }
        this.isProcessing = false;
      }
    )
  }
  
  LogOut(){
   localStorage.clear();
   this.router.navigate(['/', 'logout'])
  }
  getlistFilter(){

  }
  gotopodcasters(list){
    this._podService.podcastListData = list; 
    this.router.navigate(['/', 'about-podcast'])
  }

  

    getStatisticsList() {
      let req = {
        "user_id": this._localStorage.getUserData().id
      }
      this._webService.commonMethod('user/statistics', req, "POST").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response && data.Response.length){
            this.StatisticsList = data.Response[0];
          }
        }
      )
    }

}
