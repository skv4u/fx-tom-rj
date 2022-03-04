import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-create-podcast',
  templateUrl: './create-podcast.component.html',
  styleUrls: ['./create-podcast.component.scss']
})
export class CreatePodcastComponent implements OnInit {

  podcastForm: FormGroup;
  ispodcastFormValid: boolean = true;
  categoryList: any[] = [];
  constructor(
    public fb: FormBuilder, public _webService: WebService) { }

  ngOnInit() {
    this.podcastForm = this.fb.group({
      name: ['', [Validators.required]],
      author_name: ['', [Validators.required]],
      language: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imagepath: ['', [Validators.required]],
      audiopath: ['', [Validators.required]],
      approvals: '',
      broadcast_date: '',
      upload_date: '',
      age_restriction: '',
    })
    this.getCategoryList();
  }
  getCategoryList() {
    this._webService.commonMethod('category', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.categoryList = data.Response;
        }
      }
    )
  }
  createProcast() {
    if (!this.podcastForm.valid) {
      this.ispodcastFormValid = false;
      return
    }
    let req = {
      "user_id": 1,
      "name": this.podcastForm.value.name,
      "author_name": this.podcastForm.value.author_name,
      "language": this.podcastForm.value.language,
      "category": this.podcastForm.value.category,
      "description": this.podcastForm.value.description,
      "imagepath": this.podcastForm.value.imagepath,
      "audiopath": this.podcastForm.value.audiopath,
      "approvals": this.podcastForm.value.approvals,
      "broadcast_date": this.podcastForm.value.broadcast_date,
      "upload_date": this.podcastForm.value.upload_date,
      "age_restriction": this.podcastForm.value.age_restriction,
      "created_by": "Santosh"
    }
    this._webService.commonMethod('', req, "Post").subscribe(
      data => {

      }
    )
  }
}
