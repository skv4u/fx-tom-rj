import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-create-podcast',
  templateUrl: './create-podcast.component.html',
  styleUrls: ['./create-podcast.component.scss']
})
export class CreatePodcastComponent implements OnInit {

  podcastForm: FormGroup;
  ispodcastFormValid: boolean = true;
  audioFileName: string = '';
  pictureFileName: string = '';
  issettingOpen: boolean = false;
  isProcessing: boolean = false;
  constructor(
    public fb: FormBuilder, public _webService: WebService, public _podService: PorcastService, public toaster: ToastService, public _localStorage: LocalstorageService, public router: Router) { }

  ngOnInit() {
    this._podService.isListPage = false;
    if(this._localStorage.getUserData().approval_status != 'Approved'){
      this.toaster.error('Your approval is pending.')
      this.router.navigate(['/', 'dashboard'])
      return
    }
    this.podcastForm = this.fb.group({
      name: ['', [Validators.required]],
      author_name: ['', [Validators.required]],
      language: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imagepath: '',
      audiopath: '',
      approvals: '',
      age_restriction: false,
    })
  }
  createProcast() {
    if (!this.podcastForm.valid) {
      this.isProcessing = false;
      this.ispodcastFormValid = false;
      return
    }
    if (this.audioFileName == '') {
      this.toaster.error("Audio file is required")
      return
    }
    if (this.pictureFileName == '') {
      this.toaster.error("Podcast image is required")
      return
    }
    this.isProcessing = true;
    let req = {
      "user_id": this._localStorage.getUserData().id,
      "name": this.podcastForm.value.name,
      "author_name": this.podcastForm.value.author_name,
      "language": this.podcastForm.value.language,
      "category": this.podcastForm.value.category,
      "description": this.podcastForm.value.description,
      "imagepath": this.pictureFileName,
      "audiopath": this.audioFileName,
      "approvals": "Pending",
      "age_restriction": this.podcastForm.value.age_restriction ? 1 : 0,
      "created_by": this._localStorage.getUserData().username
    }
    this._webService.commonMethod('podcast/create', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response) {
          this.router.navigate(['/', 'create-podcast-conformation'])
        }else {

        }
        this.isProcessing = false;
      }
    )
  }

  uploadaudio(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file.type, "element");
     if(file.type.indexOf('audio') == -1){
       this.toaster.error("Invalid audio file");
       return
    }
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.isProcessing = true;
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.audioFileName = data.Response;
        this.isProcessing = false;
      }, err => {
        // this._toastService.error("Error uploading file.");
      });
    //  else {
    //    this.toaster.error('not a Audio File')
    //  }


  }


  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file, "element");
    if(file.type.indexOf('image') == -1){
      this.toaster.error("Invalid image");
      return
   }
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.isProcessing = true;
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.pictureFileName = data.Response;
        this.isProcessing = false;
      }, err => {
         this.toaster.error("Error uploading file.");
      });
    //}
    //  else {
    //    this.toaster.error('not a Audio File')
    //  }


  }

  removeFile(){
    let req = {
        filename : this.pictureFileName
    }
    this.isProcessing = true;
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.isProcessing = false;
        this.pictureFileName = '';
      },err => {
        this.isProcessing = false;
      });


  }

  removeAudio(){
    let req = {
        filename : this.audioFileName
    }
    this.isProcessing = true;
    this._webService.commonMethod("s3bucket/remove", this.audioFileName, 'DELETE').
      subscribe((data: any) => {
        this.isProcessing = false;
        this.audioFileName = '';
      },err => {
        this.isProcessing = false;
      });


  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/', 'login']);
  }

}
