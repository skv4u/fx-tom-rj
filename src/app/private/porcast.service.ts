import { Injectable } from '@angular/core';
import { WebService } from '../shared/services/web.service';

@Injectable({
  providedIn: 'root'
})
export class PorcastService {
podcastListData: any;
categoryList: any[] = [];
languageList: any[] = [];
  constructor(public _webService: WebService) { }
  getCategoryList() {
    this._webService.commonMethod('category', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.categoryList = data.Response;
        }
      }
    )
  }
  getLanguageList() {
    this._webService.commonMethod('language', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.languageList = data.Response;
        }
      }
    )
  }
}
