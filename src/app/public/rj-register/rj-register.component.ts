import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PorcastService } from 'src/app/private/porcast.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-rj-register',
  templateUrl: './rj-register.component.html',
  styleUrls: ['./rj-register.component.scss'],
  providers: [FormBuilder]
})
export class RjRegisterComponent implements OnInit {

  registerForm: FormGroup;
  isregisterFormValid: boolean = true;
  isPasswordValid: boolean = true;
  country: string = '';
  state: string = '';
  countryList: any[] = [];
  stateList: any[] = [];
  isPersonalInformationOpen: boolean = true;
  isdisplayinformationOpen: boolean = false;
  pictureFileName: string = '';
  MINIMUM_AGE: number = 13;
  MAXIMUM_AGE: number = 100;
  ISD: string = '';
  constructor(
    public fb: FormBuilder, public _webService: WebService, public router: Router, public toaster: ToastService, public _commonService: CommonService, public _podService: PorcastService) { }

  ngOnInit() {
    //  console.log(this.date, "date");
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required,
        this._commonService.customAlphanumaric,
        this._commonService.customSpaceValidation]],
      usertype: 'RJ',
      dob: ['', [Validators.required]],
      isd: '',
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), this._commonService.customNumber]],
      email: ['', [Validators.required, this._commonService.customEmail,,
        this._commonService.customSpaceValidation]],
      profile_image: '',
      podcaster_type: 'individual',
      podcaster_value: '',
      address1: '',
      address2: '',
      address3: '',
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: '',
      aboutme: '',
      twitter: '',
      facebook: '',
      snapchat: '',
      blogger: '',
      telegram: '',
      linkedin: ''
    })
    this.getCountryList();
  }

  register() {
    //   this._podService.loader = true;
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
       this._podService.loader = false;
      if(this.registerForm.value.confirmPassword == ''){
        this.toaster.error("Confirm Password is required");
      }else {
        this.toaster.error("Confirm Password not matched");
      }
      //  this.isPasswordValid = false;
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
        "fullname": this.registerForm.value.fullname,
        "username": this.registerForm.value.username,
        "password": this.registerForm.value.password,
        "usertype": this.registerForm.value.usertype,
        "dob": this.registerForm.value.dob,
        "isd": this.ISD,
        "phone":this.registerForm.value.phone,
        "email": this.registerForm.value.email,
        "profile_image": this.pictureFileName,
        "podcaster_type": this.registerForm.value.podcaster_type,
        "podcaster_value": this.registerForm.value.podcaster_value,
        "address1": this.registerForm.value.address1,
        "address2": this.registerForm.value.address2,
        "address3": this.registerForm.value.address3,
        "country": this.country,
        "state": this.state,
        "aboutme": this.registerForm.value.aboutme,
        "twitter": this.registerForm.value.twitter,
        "facebook": this.registerForm.value.facebook,
        "snapchat": this.registerForm.value.snapchat,
        "blogger": this.registerForm.value.blogger,
        "telegram": this.registerForm.value.telegram,
        "linkedin": this.registerForm.value.linkedin
      }
       this._podService.loader = true;
      this._webService.commonMethod('user/register', req, "POST").subscribe(
        data => {
           this._podService.loader = false;
          if (data.Response.indexOf("Duplicate") != -1) {
            this.toaster.error("'" + this.registerForm.value.username + ' or ' + this.registerForm.value.phone + "' is already Exsits");
            return
          }
          if (data.Status == 'Success' && data.Response) {
            this.emailSend(req);
            this.toaster.success('Registration done Successfully');
            this.router.navigate(['/', 'register-thanks'])
          } else {
            this.toaster.error(data.Response);
          }
        }
      )
    }
  }
  getCountryList() {
    this._webService.commonMethod('country', '', "GET").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.countryList = data.Response;
          this.country = "India";
          this.ISD = "+91"
          this.getStateList();
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
    return null
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

  removeFile() {
    let req = {
      filename: this.pictureFileName
    }
     this._podService.loader = true;
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
         this._podService.loader = false;
        this.pictureFileName = '';
      }, err => {
        this.pictureFileName = '';
         this._podService.loader = false;
      });


  }
  getpodcastdisable() {
    if (this.registerForm.value.podcaster_type == 'individual') {
      this.registerForm.get("podcaster_value").setValue('');
    }
  }

  validation() {

    let diff = new Date().getFullYear() - new Date(this.registerForm.value.dob).getFullYear();

    if ((this.MAXIMUM_AGE < diff) || (this.MINIMUM_AGE > diff)) {
      this.toaster.error("Invalid date of birth");
      return
    }
  }
  emailSend(data) {
    // info@tomtompodcast.com,pchaitanya25596@gmail.com
    let req = {
      "to": "admin@tomtompodcast.com",
      "to_name": data.username,
      "cc": "",
      "bcc": "",
      "subject":  data.fullname + " - New RJ Registered",
      "content": this.emailtemplate(data)
    }  
    this._webService.commonMethod('email/send', req, "POST").subscribe(
      data => {

      })
  }
  emailtemplate(data){
    let url = window.location.origin + "/admin/#/login";
    return (`<p> Hi <strong>Admin</strong>,</p>
      <p>New RJ has been registered.</p>
      <p>Here is the details</p>
      <p>Name : ${data.fullname}</p>
      <p>Username :  ${data.username}</p>
      <p>Email : ${data.email}</p>
      <p>Mobile : ${data.phone}</p>
      <p><a href=${url} target="_blank"> Click here to View/Approve</a></p>
      <p>&nbsp;</p>
      <p>Regards,<br />Tomtom Team.</p>`);
  }
}
