import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PorcastService } from 'src/app/private/porcast.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  registerForm: FormGroup;
  isregisterFormValid: boolean = true;
  isPasswordValid: boolean = true;
  country: string = '';
  state: string = '';
  countryList: any[] = [];
  stateList: any[] = [];
  reasonforEdit: string = '';
  pictureFileName: string = '';
  isPersonalInformationOpen: boolean = true;
  isdisplayinformationOpen: boolean = false;
  MINIMUM_AGE: number = 13;
  MAXIMUM_AGE: number = 100;
  isindividual: boolean = false;
  ISD: string = '';
  constructor(
    public fb: FormBuilder, public _webService: WebService, public router: Router, public toaster: ToastService, public _localStorage: LocalstorageService, public _commonService: CommonService, public _podService: PorcastService) { }
  ngOnInit() {
    this._podService.isListPage = false;
    this._podService.AllfilterValues.issettingOpen=false
   
    console.log(this._podService.localStorageData,"his._podService.localStorageData")
    this.country = this._podService.localStorageData.country;
    this.state = this._podService.localStorageData.state;
    this.pictureFileName = this._podService.localStorageData.profile_image;
    this.ISD = this._podService.localStorageData.isd ? this._podService.localStorageData.isd : "+91";
    this.registerForm = this.fb.group({
      fullname: [this._podService.localStorageData.fullname, [Validators.required]],
      username: [this._podService.localStorageData.username, [Validators.required,
        this._commonService.customAlphanumaric,
        this._commonService.customSpaceValidation]],
      usertype: 'RJ',
      dob: [this._podService.localStorageData.dob, [Validators.required]],
      isd: this._podService.localStorageData.isd,
      phone: [this._podService.localStorageData.phone, [Validators.required,Validators.minLength(10),Validators.maxLength(10),this._commonService.customNumber]],
      email: [this._podService.localStorageData.email, [Validators.required,this._commonService.customEmail,this._commonService.customSpaceValidation]],
      profile_image: this._podService.localStorageData.profile_image,
      podcaster_type: this._podService.localStorageData.podcaster_type,
      podcaster_value: this._podService.localStorageData.podcaster_value,
      address1: this._podService.localStorageData.address1,
      address2: this._podService.localStorageData.address2,
      address3: this._podService.localStorageData.address3,
      aboutme: this._podService.localStorageData.aboutme,
      twitter: this._podService.localStorageData.twitter,
      facebook: this._podService.localStorageData.facebook,
      snapchat: this._podService.localStorageData.snapchat,
      blogger: this._podService.localStorageData.blogger,
      telegram: this._podService.localStorageData.telegram,
      linkedin: this._podService.localStorageData.linkedin
    })
    this.getCountryList();
    this.isindividual = this.registerForm.value.podcaster_type == 'individual' ? true : false;
  }

  updateProfile() {
    let diff = new Date().getFullYear() - new Date(this.registerForm.value.dob).getFullYear();

    // if ((this.MAXIMUM_AGE < diff) || (this.MINIMUM_AGE > diff)) {
      if (!(diff>= this.MINIMUM_AGE && diff<= this.MAXIMUM_AGE)){
      this.toaster.error("Invalid Date");
      return
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this._podService.loader = false;
      this.isPasswordValid = false;
      return
    }if(this.reasonforEdit == ''){
      this.toaster.error("Please enter some notes");
      return
    }
    if(this.registerForm.value.podcaster_type == 'organization' && this.registerForm.value.podcaster_value == ''){
      this.toaster.error("Organisation working for is required");
      return
    }
    if (!this.registerForm.valid) { 
      this._podService.loader = false;
      this.isregisterFormValid = false;
      return
    } else {
      let req = {
        // "id":3,
        // "fullname": this.registerForm.value.fullname,
        // "username": this.registerForm.value.username,
        // "password": '',
        // "usertype": this.registerForm.value.usertype,
        // "dob": this.registerForm.value.dob,
        // "isd": this.registerForm.value.isd,
        // "phone": this.registerForm.value.phone,
        // "email": this.registerForm.value.email,
        // "profile_image": this.registerForm.value.profile_image,
        // "podcaster_type": this.registerForm.value.podcaster_type,
        // "podcaster_value": this.registerForm.value.podcaster_value,
        // "address1": this.registerForm.value.address1,
        // "address2": this.registerForm.value.address2,
        // "address3": this.registerForm.value.address3,
        // "country": this.country,
        // "state": this.state






        // {
          "id": this._podService.localStorageData.id,
          "fullname": this.registerForm.value.fullname,
          "username":  this.registerForm.value.username,
          "dob": this.registerForm.value.dob,
          "isd": this.ISD,
          "phone": this.registerForm.value.phone,
          "email": this.registerForm.value.email,
          "profile_image": this.pictureFileName,
          "podcaster_type": this.registerForm.value.podcaster_type,
          "podcaster_value": this.registerForm.value.podcaster_value,
          "address1": this.registerForm.value.address1,
          "address2": this.registerForm.value.address2,
          "address3": this.registerForm.value.address3,
          "country": this.country,
          "state": this.state,
          "usertype":this.registerForm.value.usertype,
          "note_description": this.reasonforEdit,
          "created_by": this._podService.localStorageData.username,
          "aboutme": this.registerForm.value.aboutme,
          "twitter": this.registerForm.value.twitter,
          "facebook": this.registerForm.value.facebook,
          "snapchat": this.registerForm.value.snapchat,
          "blogger": this.registerForm.value.blogger,
          "telegram": this.registerForm.value.telegram,
          "linkedin": this.registerForm.value.linkedin
        //   }
      }
      this._podService.loader = true; 
      this._webService.commonMethod('user/update', req, "PUT").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response){
            this._podService.loader = false;
            this.toaster.success('Updated Successfully');
          //  this._localStorage.setUserData(req);
           // this._podService.localStorageData = req;
          // this._podService.viewDetails();
            this.router.navigate(['/', 'dashboard'])
            }else {
             this.toaster.error(data.Response);
            }
        }
      )
    }
  }
  getCountryList(){
    this._podService.loader = true;
    this._webService.commonMethod('country', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.countryList = data.Response;
          this. getStateList();
          this._podService.loader = false;
        }
      }
    )
  }

  getStateList() {
    this.stateList = [];
    let countryid = this.getCountryId();
    this._webService.commonMethod('country/state/' + countryid, '', "GET").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.stateList = data.Response;
          this.state = this.stateList[0].name;
        }
      }
    )
  }

  getCountryId() {
    for (let a of this.countryList) {
      if (a.name == this.country) {
        return a.id;
      }
    }
    return null;
  }

 
  uploadFile(element) {​​
  this._podService.loader=true;
  this._podService.loaderMessage = "Uploading...";
  const file = element[0];
  if (file == undefined) return;
  // console.log(file, "element");
  let formData = new FormData();
  formData.append('filename', file, file.name);
  this._webService.UploadDocument1("s3bucket/upload", formData).
  subscribe((data: any) => {​​
  if (data.type === HttpEventType.Response) {​​
  this.pictureFileName = data.body.Response;
  this._podService.loader = false;
  this._podService.loaderMessage = "Loading...";
  }​​
  if (data.type === HttpEventType.UploadProgress) {​​
  const percentDone = Math.round(100 * data.loaded / data.total);
  this._podService.loaderMessage = " Uploading : " + percentDone + "%";
  }​​
  }​​, err => {​​
  this._podService.loader = false;
  this.pictureFileName = "";
  this._podService.loaderMessage = "Loading...";
  }​​);
  }

  removeFile(){
    let req = {
        filename : this.pictureFileName
    }
    this._podService.loader = true;
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this._podService.loader = false;
        this.pictureFileName = '';
      },err => {
        this.pictureFileName = '';
        this._podService.loader = false;
      });


  }

  getpodcastdisable(){
    if(this.registerForm.value.podcaster_type == 'individual'){
      this.isindividual = true;
     this.registerForm.get("podcaster_value").setValue('');
    }else{
      this.isindividual = false;
    }
  }
  validation() {

    let diff = new Date().getFullYear() - new Date(this.registerForm.value.dob).getFullYear();

    if ((this.MAXIMUM_AGE < diff) || (this.MINIMUM_AGE > diff)) {
      this.toaster.error("Invalid date of birth");
      return
    }
  }

}
