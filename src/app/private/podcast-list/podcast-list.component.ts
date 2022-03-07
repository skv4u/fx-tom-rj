import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit {

  RJDasboardList: any[] = [];
  issettingOpen: boolean = false;
  iscategoryOpen: boolean = false;
  constructor(public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router) { }

  ngOnInit() {
    if(!this._localStorage.getUserData()){
    this.router.navigate(['/','login'])
    return
  }
    this.getPodcastList();
    this._podService.getCategoryList();
    this._podService.getLanguageList();
  }
  getPodcastList() {
    let req = {
      "user_id": this._localStorage.getUserData().id,
      "podcast_id": ""
    }
    this._webService.commonMethod('podcast/list', req, "POST").subscribe(
      data => {
        if (data.Status == "Success" && data.Response && data.Response.length) {
          this.RJDasboardList = data.Response;
        }
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


}
