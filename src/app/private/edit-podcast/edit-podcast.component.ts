import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
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
  audioFileName: string = '';
  pictureFileName: string = '';
  noteDescription: string = '';
  isProcessing: boolean = false;
  constructor(
    public fb: FormBuilder, public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) { }

  ngOnInit() {
    if(this._localStorage.getUserData().approval_status != 'Approved'){
      this.toaster.error('Your approval is pending.')
      this.router.navigate(['/', 'dashboard'])
      return
    }
    this._podService.getNodeList();
    this.audioFileName = this._podService.podcastListData.audiopath;
    this.pictureFileName = this._podService.podcastListData.imagepath;
    this.podcastForm = this.fb.group({
      name: [this._podService.podcastListData.name, [Validators.required]],
      author_name: [this._podService.podcastListData.author_name, [Validators.required]],
      language: [this._podService.podcastListData.language, [Validators.required]],
      category: [this._podService.podcastListData.category, [Validators.required]],
      description: [this._podService.podcastListData.description, [Validators.required]],
      imagepath: this._podService.podcastListData.imagepath,
      audiopath: this._podService.podcastListData.audiopath,
      approvals: this._podService.podcastListData.approvals,
      // broadcast_date: this._podService.podcastListData.broadcast_date,
      // upload_date: this._podService.podcastListData.upload_date,
      age_restriction: Number(this._podService.podcastListData.age_restriction) ? true : false,
    })
  }

  uploadAudio(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file, "element");
    // if(file.type.include('audio')){
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.audioFileName = data.Response;
      }, err => {
        // this._toastService.error("Error uploading file.");
      });
    //}
    //  else {
    //    this.toaster.error('not a Audio File')
    //  }


  }

  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file, "element");
    // if(file.type.include('audio')){
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.audioFileName = data.Response;
      }, err => {
        // this._toastService.error("Error uploading file.");
      });
    //}
    //  else {
    //    this.toaster.error('not a Audio File')
    //  }


  }

  updateProcast() {
    this.isProcessing = true;
    if (!this.podcastForm.valid) {
      this.isProcessing = false;
      this.ispodcastFormValid = false;
      return
    }
    if(this.noteDescription == ''){
      this.isProcessing = false;
      this.toaster.error("Notes are Required")
      return
    }
    let req = {
      "id": this._podService.podcastListData.id,
      "user_id": this._localStorage.getUserData().id,
      "name": this.podcastForm.value.name,
      "author_name": this.podcastForm.value.author_name,
      "language": this.podcastForm.value.language,
      "category": this.podcastForm.value.category,
      "description": this.podcastForm.value.description,
      "imagepath": this.pictureFileName,
      "audiopath": this.audioFileName,
      "age_restriction": this.podcastForm.value.age_restriction ? 1 : 0,
      "created_by": this._localStorage.getUserData().username,
      "usertype": "RJ",
      "note_description": this.noteDescription,
      "status": this.podcastForm.value.approvals
    }
    this._webService.commonMethod('podcast/update', req, "PUT").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response) {
          this.router.navigate(['/', 'dashboard'])
        } else {

        }
        this.isProcessing = true;
      }
    )
  }

  removeFile(){
    let req = {
        filename : this.pictureFileName
    }
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.pictureFileName = '';
      });


  }

  removeAudio(){
    let req = {
        filename : this.audioFileName
    }
    this._webService.DeleteDocument("s3bucket/remove", this.audioFileName, 'DELETE').
      subscribe((data: any) => {
        this.audioFileName = '';
      });


  }


}
