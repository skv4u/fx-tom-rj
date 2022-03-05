import { Component, OnInit } from '@angular/core';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-about-podcast',
  templateUrl: './about-podcast.component.html',
  styleUrls: ['./about-podcast.component.scss']
})
export class AboutPodcastComponent implements OnInit {

  constructor(public _podService: PorcastService) { }

  ngOnInit() {
    console.log(this._podService.podcastListData,"+++++++++++")
    this._podService.getNodeList();
  }

}
