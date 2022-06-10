import { Component } from '@angular/core';
import { PorcastService } from './private/porcast.service';
import { LocalstorageService } from './shared/services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tomtom';
  constructor(public _podService: PorcastService, public _localService: LocalstorageService) {
    // if (document.location.hash == "#/dashboard") {
    //   this._podService.loader = true;
    // }

    this._podService.localStorageData = this._localService.getUserData();
    if (this._podService.localStorageData) {
      this._podService.loader = false;
    }
    // if(this._podService.localStorageData && window.location.hash.indexOf('chat') == -1){
    if (this._podService.localStorageData) {
      this._podService.getCategoryList();
      this._podService.getLanguageList();
      this._podService.getshowList();
      if (window.location.hash == '#/create-podcast')
        this._podService.getPodcastList();
    }

    // }
  }
}
