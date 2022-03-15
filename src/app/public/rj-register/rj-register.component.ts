import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
  isProgressing: boolean = false;
  isPersonalInformationOpen: boolean = true;
  isdisplayinformationOpen: boolean = false;
  pictureFileName: string = '';
  MINIMUM_AGE: number = 15;
  MAXIMUM_AGE: number = 60;
  isindividual: boolean = false;
  ISD: string = '';
  constructor(
    public fb: FormBuilder, public _webService: WebService, public router: Router, public toaster: ToastService, public _commonService: CommonService) { }

  ngOnInit() {
    //  console.log(this.date, "date");
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      usertype: 'RJ',
      dob: ['', [Validators.required]],
      isd: '',
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), this._commonService.customNumber]],
      email: ['', [Validators.required, this._commonService.customEmail, Validators.maxLength(60)]],
      profile_image: '',
      podcaster_type: 'Individual',
      podcaster_value: '',
      address1: '',
      address2: '',
      address3: '',
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60), this._commonService.customPassword]],
      confirmPassword: ['', [Validators.required]],
      aboutme: '',
      twitter: '',
      facebook: '',
      snapchat: '',
      blogger: '',
      telegram: '',
      linkedin: ''
    })
    this.isindividual = this.registerForm.value.podcaster_type == 'Individual' ? true : false
    this.getCountryList();
  }

  register() {
    //  this.isProgressing = true;
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.isProgressing = false;
      this.isPasswordValid = false;
      return
    }
    if (!this.registerForm.valid) {
      this.isProgressing = false;
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
        "phone": this.ISD ? this.ISD + this.registerForm.value.phone : this.registerForm.value.phone,
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
      this.isProgressing = true;
      this._webService.commonMethod('user/register', req, "POST").subscribe(
        data => {
          this.isProgressing = false;
          if (data.Response.indexOf("Duplicate") != -1) {
            this.toaster.error("'" + this.registerForm.value.username + ' or ' + this.registerForm.value.phone + "' is already Exsits");
            return
          }
          if (data.Status == 'Success' && data.Response) {
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
    let id = '';
    for (let a of this.countryList) {
      if (a.name == this.country) {
        id = a.id;
      }
    }
    return id
  }

  removeSpace(ele) {
    const charCode = (ele.which) ? ele.which : ele.keyCode;
    if (charCode == 32) {
      return true;
    }

    return true;
    //   if (ele.which == 32){
    //     console.log('Space Detected');
    //     return false;
    // }
  }
  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file, "element");
    if (file.type.indexOf('image') == -1) {
      this.toaster.error("Invalid image");
      return
    }
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.isProgressing = true;
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.pictureFileName = data.Response;
        this.isProgressing = false;
      }, err => {
        this.toaster.error("Error uploading file.");
      });
    //}
    //  else {
    //    this.toaster.error('not a Audio File')
    //  }


  }

  removeFile() {
    let req = {
      filename: this.pictureFileName
    }
    this.isProgressing = true;
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.isProgressing = false;
        this.pictureFileName = '';
      }, err => {
        this.pictureFileName = '';
        this.isProgressing = false;
      });


  }
  getpodcastdisable() {
    this.isindividual = this.registerForm.value.podcaster_type == 'Individual' ? true : false;
  }

  validation() {

    let diff = new Date().getFullYear() - new Date(this.registerForm.value.dob).getFullYear();

    if ((this.MAXIMUM_AGE < diff) || (this.MINIMUM_AGE > diff)) {
      this.toaster.error("Invalid date of birth");
      return
    }
  }

}
