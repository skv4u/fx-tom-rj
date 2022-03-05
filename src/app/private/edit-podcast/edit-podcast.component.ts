import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';
@Component({
  selector: 'app-edit-podcast',
  templateUrl: './edit-podcast.component.html',
  styleUrls: ['./edit-podcast.component.scss']
})
export class EditPodcastComponent implements OnInit {

  podcastForm: FormGroup;
  ispodcastFormValid: boolean = true;
  categoryList: any[] = [];
  constructor(
    public fb: FormBuilder, public _webService: WebService, public _podService: PorcastService) { }

  ngOnInit() {
    this.podcastForm = this.fb.group({
      name: [this._podService.podcastListData.name, [Validators.required]],
      author_name: [this._podService.podcastListData.author_name, [Validators.required]],
      language: [this._podService.podcastListData.language, [Validators.required]],
      category: [this._podService.podcastListData.category, [Validators.required]],
      description: [this._podService.podcastListData.description, [Validators.required]],
      imagepath: [this._podService.podcastListData.imagepath, [Validators.required]],
      audiopath: [this._podService.podcastListData.audiopath, [Validators.required]],
      approvals: this._podService.podcastListData.approvals,
      // broadcast_date: this._podService.podcastListData.broadcast_date,
      // upload_date: this._podService.podcastListData.upload_date,
      age_restriction: this._podService.podcastListData.age_restriction,
    })
  }

}
