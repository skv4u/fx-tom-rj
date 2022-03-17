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
  isProgessing: boolean = false;
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
    if(this._podService.localStorageData.approval_status == 'Pending'){
      this.toaster.error('Your approval is pending.')
      this.router.navigate(['/', 'dashboard'])
      return
    }
    if (this._podService.localStorageData.approval_status == 'Rejected') {
      this.toaster.error('Please contact Admin');
      this.router.navigate(['/', 'dashboard'])
      return
    }
    console.log(this._podService.localStorageData,"his._podService.localStorageData")
    this.country = this._podService.localStorageData.country;
    this.state = this._podService.localStorageData.state;
    this.pictureFileName = this._podService.localStorageData.profile_image;
    this.ISD = this._podService.localStorageData.isd ? this._podService.localStorageData.isd : "+91";
    this.registerForm = this.fb.group({
      fullname: [this._podService.localStorageData.fullname, [Validators.required]],
      username: [this._podService.localStorageData.username, [Validators.required]],
      usertype: 'RJ',
      dob: [this._podService.localStorageData.dob, [Validators.required]],
      isd: this._podService.localStorageData.isd,
      phone: [this._podService.localStorageData.phone, [Validators.required,Validators.minLength(10),Validators.maxLength(10),this._commonService.customNumber]],
      email: [this._podService.localStorageData.email, [Validators.required,this._commonService.customEmail]],
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
      this.isProgessing = false;
      this.isPasswordValid = false;
      return
    }if(this.reasonforEdit == ''){
      this.toaster.error("Please enter some notes");
      return
    }
    if (!this.registerForm.valid) { 
      this.isProgessing = false;
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
      this.isProgessing = true; 
      this._webService.commonMethod('user/update', req, "PUT").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response){
            this.isProgessing = false;
            this.toaster.success('Updated Successfully');
          //  this._localStorage.setUserData(req);
           // this._podService.localStorageData = req;
           this._podService.viewDetails();
            this.router.navigate(['/', 'dashboard'])
            }else {
             this.toaster.error(data.Response);
            }
        }
      )
    }
  }
  getCountryList(){
    this.isProgessing = true;
    this._webService.commonMethod('country', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.countryList = data.Response;
          this. getStateList();
          this.isProgessing = false;
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
    this.isProgessing = true;
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.pictureFileName = data.Response;
        this.isProgessing = false;
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
    this.isProgessing = true;
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.isProgessing = false;
        this.pictureFileName = '';
      },err => {
        this.pictureFileName = '';
        this.isProgessing = false;
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
