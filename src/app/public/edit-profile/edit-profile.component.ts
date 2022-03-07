import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(
    public fb: FormBuilder, public _webService: WebService, public router: Router, public toaster: ToastService, public _localStorage: LocalstorageService) { }
  ngOnInit() {
    this.country = this._localStorage.getUserData().country;
    this.state = this._localStorage.getUserData().state;
    this.registerForm = this.fb.group({
      fullname: [this._localStorage.getUserData().fullname, [Validators.required]],
      username: [this._localStorage.getUserData().username, [Validators.required]],
      usertype: 'RJ',
      dob: [this._localStorage.getUserData().dob, [Validators.required]],
      isd: this._localStorage.getUserData().isd,
      phone: [this._localStorage.getUserData().phone, [Validators.required]],
      email: [this._localStorage.getUserData().email, [Validators.required]],
      profile_image: this._localStorage.getUserData().profile_image,
      podcaster_type: this._localStorage.getUserData().podcaster_type == 'individual' ? 'Individual' : "Organisation",
      podcaster_value: this._localStorage.getUserData().podcaster_value,
      address1: this._localStorage.getUserData().address1,
      address2: this._localStorage.getUserData().address2,
      address3: this._localStorage.getUserData().address3
    })
    this.getCountryList();
  }

  updateProfile() {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.isPasswordValid = false;
      return
    }
    if (!this.registerForm.valid) {
      this.isregisterFormValid = false;
      return
    } else {
      let req = {
        "fullname": this.registerForm.value.fullname,
        "username": this.registerForm.value.username,
        "password": '',
        "usertype": this.registerForm.value.usertype,
        "dob": this.registerForm.value.dob,
        "isd": this.registerForm.value.isd,
        "phone": this.registerForm.value.phone,
        "email": this.registerForm.value.email,
        "profile_image": this.registerForm.value.profile_image,
        "podcaster_type": this.registerForm.value.podcaster_type,
        "podcaster_value": this.registerForm.value.podcaster_value,
        "address1": this.registerForm.value.address1,
        "address2": this.registerForm.value.address2,
        "address3": this.registerForm.value.address3,
        "country": this.country,
        "state": this.state
      }
      this._webService.commonMethod('user/register', req, "POST").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response){
            this.router.navigate(['/', 'dashboard'])
            }else {
             this.toaster.error(data.Response);
            }
        }
      )
    }
  }
  getCountryList(){
    this._webService.commonMethod('country', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.countryList = data.Response;
          let id: string = '';
          for(let country of data.Response){
            if(country.name == this.country){
              id = country.id;
            }
          }
          this.country =  this.country ? id :"91";
          this. getStateList();
        }
      }
    )
  }

  getStateList(){
    this.stateList = [];
    this._webService.commonMethod('country/state/' + this.country, '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.stateList = data.Response;
          this.state = this.stateList[0].name;
        }
      }
    )
  }
}
