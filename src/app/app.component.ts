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
  constructor(public _podService: PorcastService, public _localService: LocalstorageService){
    this._podService.loader = true;
    this._podService.localStorageData = this._localService.getUserData();
    this._podService.getCategoryList();
    this._podService.getLanguageList();
  }
}
