import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit {

  RJDasboardList: any[] = [];

  constructor(public _webService: WebService, public _podService: PorcastService) { }

  ngOnInit() {
    this.getPodcastList();
  }
  getPodcastList() {
    let req = {
      "user_id": 1,
      "podcast_id": ""
    }
    console.log(req,"req");
    this._webService.commonMethod('podcast/list', req, "POST").subscribe(
      data => {
        if (data.Status == "Success" && data.Response && data.Response.length) {
          this.RJDasboardList = data.Response;
        }
      }
    )
  }
}
