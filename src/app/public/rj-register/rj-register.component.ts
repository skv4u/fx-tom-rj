import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  countryList: any[] = [];
  stateList: any[] = [];
  constructor(
    public fb: FormBuilder, public _webService: WebService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullname: '',
      username: ['', [Validators.required]],
      usertype: 'Individual',
      dob: ['', [Validators.required]],
      isd: '',
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      profile_image: '',
      podcaster_type: '',
      podcaster_value: '',
      address1: '',
      address2: '',
      address3: '',
      country: '',
      state: '',
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
    this.getCountryList();
  }

  register() {
    debugger
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
        "password": this.registerForm.value.password,
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
        "country": this.registerForm.value.country,
        "state": this.registerForm.value.state
      }
      this._webService.commonMethod('user/register', req, "POST").subscribe(
        data => {
          console.log(data, "data");
        }
      )
    }
  }
  getCountryList(){
    this._webService.commonMethod('country', '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.countryList = data.Response;
        }
      }
    )
  }

  getStateList(){
    this._webService.commonMethod('country/state/' + this.registerForm.value.country, '', "GET").subscribe(
      data => {
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.stateList = data.Response;
        }
      }
    )
  }
}
