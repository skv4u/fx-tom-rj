import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-rj-comments',
  templateUrl: './rj-comments.component.html',
  styleUrls: ['./rj-comments.component.scss']
})
export class RjCommentsComponent implements OnInit {

  commentList: any[] = [];

  constructor(public _podService: PorcastService, public _webService: WebService) { }

  ngOnInit() {
    this._podService.isListPage = false;
    this._podService.AllfilterValues.issettingOpen = false
    this.getcommentList();
  }

  getcommentList() {
    this._podService.loader = true;
    let req = {
      "podcast_id": "91",
      "user_id": "79"
    }
    this._webService.commonMethod('mobuser/podcast/commentreplylist', req, "POST").subscribe(
      data => {
        this._podService.loader = false;
        if (data.Status == 'Success' && data.Response) {
          this.commentList = data.Response;
        }
      }
    )

  }

}
