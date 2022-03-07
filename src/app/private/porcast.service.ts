import { Injectable } from '@angular/core';
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
  constructor(public _webService: WebService) { }
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

  searchList(data?:any) {
    debugger
    let tempdata=data ? data : this.serachvalue;
    let temp = this.RJDasboardList1.filter(x => JSON.stringify(x).toLowerCase().includes(tempdata.toLowerCase()));
    this.RJDasboardList = temp;
    }
}
