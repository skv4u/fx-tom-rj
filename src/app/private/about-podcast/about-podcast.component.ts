import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-about-podcast',
  templateUrl: './about-podcast.component.html',
  styleUrls: ['./about-podcast.component.scss']
})
export class AboutPodcastComponent implements OnInit {

  constructor(public _podService: PorcastService, public _localStorage: LocalstorageService, public toaster: ToastService, public router: Router) { }

  ngOnInit() {
    if (this._podService.localStorageData.approval_status != 'Approved') {
      this.toaster.error('Your approval is pending.')
      this.router.navigate(['/', 'dashboard'])
      return
    }
    if (!this._podService.podcastListData) {
      this.router.navigate(['/', 'dashboard'])
      return
    }
    this._podService.isListPage = false;
    this._podService.iscreatebuttonVisiable=false;
    this._podService.podcastListData.age_restriction = this._podService.podcastListData.age_restriction == '0' ? false : true
    console.log(this._podService.podcastListData, "+++++++++++");
    this._podService.getNodeList();
  }  
  getAudioName() {
    if (this._podService.podcastListData.audiopath) {
      let str = this._podService.podcastListData.audiopath.substring(this._podService.podcastListData.audiopath.lastIndexOf("/") + 1);
      return str.substring(str.indexOf("_") + 1);
    }
    return '';
  }

}
