import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-podcast-list',
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit {

RJDasboardList: any[] = [{
  "Image": 'assets/images/login-img.jpg',
  "Title": 'Podcast 1',
  "Category": 'Comedy,Politics',
  "UpdateDate": '02-03-2022',
  "Status": 'Live',
  "BroadcastDate": '25th Jan 2021',
  "UserComments": 'None',
  "LatestNotes": 'Poor Quility',
  "BroadcastTime": '2:30',
  "UpdateTime": '2:30',
},{
  "Image": 'assets/images/login-img.jpg',
  "Title": 'Podcast 2',
  "Category": 'Comedy,Politics',
  "UpdateDate": '02-03-2022',
  "Status": 'Live',
  "BroadcastDate": '25th Jan 2021',
  "UserComments": 'None',
  "LatestNotes": 'Poor Quility',
  "BroadcastTime": '2:30',
  "UpdateTime": '2:30',
}];

  constructor() { }

  ngOnInit() {
  }

}
