import { Component, OnInit } from '@angular/core';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-rj-comments',
  templateUrl: './rj-comments.component.html',
  styleUrls: ['./rj-comments.component.scss']
})
export class RjCommentsComponent implements OnInit {

  constructor(public _podService: PorcastService ) { }

  ngOnInit() {
    this._podService.isListPage = false;
    this._podService.AllfilterValues.issettingOpen=false
  }

}
