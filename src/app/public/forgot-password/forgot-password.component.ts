import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/shared/services/web.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [FormBuilder]
})
export class ForgotPasswordComponent implements OnInit {
  mobileNumber: number;
  isProgessing: boolean = false;
  isMobileNumberValid: boolean = true;
  MobileNumberForm: FormGroup;
  constructor(public _webService: WebService, public fb: FormBuilder, public _commonService: CommonService) { }

  ngOnInit() {
    this.MobileNumberForm = this.fb.group({
      mobile: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),this._commonService.customNumber]],
    })
  }
  getOTP(){
    this.isProgessing = true;
    if(!this.MobileNumberForm.valid){
      this.isProgessing = false;
      this.isMobileNumberValid = false;
      return
    }
   let req = {
      "mobile": this.MobileNumberForm.value.mobile
      }
      this._webService.commonMethod('sms/otp', req, "POST").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response){
            this.isProgessing = false;
          }
        }
      )
  }

  sendOTP(){
    let req = {
      "mobile": this.MobileNumberForm.value.mobile,
      "otp": "434351"
      }
      this._webService.commonMethod('sms/validate', req, "POST").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response){
            this.isProgessing = false;
          }
        }
      )
  }

}
