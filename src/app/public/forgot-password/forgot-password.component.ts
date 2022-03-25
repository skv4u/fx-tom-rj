import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/shared/services/web.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { PorcastService } from 'src/app/private/porcast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [FormBuilder]
})
export class ForgotPasswordComponent implements OnInit {
  mobileNumber: number;
  isMobileNumberValid: boolean = true;
  MobileNumberForm: FormGroup;
  ismobilenumber: boolean = false;
  InputList: any = {
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    input6: ''
  } //= new Array(6).fill('');
  constructor(public _webService: WebService, public fb: FormBuilder, public _commonService: CommonService, public router: Router, public toaster: ToastService, public _podCastService: PorcastService) { }

  ngOnInit() {
    this.MobileNumberForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), this._commonService.customNumber]],
    })
  }
  getOTP() {
    this._podCastService.loader = true;
    if (!this.MobileNumberForm.valid) {
      this._podCastService.loader = false;
      this.isMobileNumberValid = false;
      return
    }
    let req = {
      "mobile": this.MobileNumberForm.value.mobile,
      "type": 'web'
    }
    this._webService.commonMethod('sms/otp', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response) {
          this.toaster.success(data.Response);
          this._podCastService.loader = false;
          this.ismobilenumber = true;
        }else{
          this.toaster.error(data.Response);
          this._podCastService.loader = false;
        }
      }
    )
  }

  sendOTP() {
    if (!this.MobileNumberForm.value.mobile) {
      this.toaster.error("Please enter mobile number");
      return
    }
    let otp: string = '';
    for (let m in this.InputList) {
      otp += this.InputList[m];
    }
    if(otp.length != 6){
      this.toaster.error("Invalid OTP");
      return
    }
    this._podCastService.loader = true;

    let req = {
      "mobile": this.MobileNumberForm.value.mobile,
      "otp": otp,
      "type": 'web'
    }
    this._webService.commonMethod('sms/validate', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response) {
          this._podCastService.mobileNumber = this.MobileNumberForm.value.mobile;
          this.toaster.success('OTP verified successfully');
          this.ismobilenumber = false;
          this.router.navigate(['/', 'reset-password']);
        } else if (data.Status == 'Success' && !data.Response) {
          this.toaster.error("Invalid OTP")
        }
        this._podCastService.loader = false;
      }
    )
  }

  restrictKey(elem: any, index: number) {
    // console.log(elem.keyCode);
    let keyCodeList: number[] = [32];
    if (keyCodeList.indexOf(elem.keyCode) !== -1) return false;
    if (elem.keyCode == 8) {
      index--;
      if (document.getElementById('input' + index))
        document.getElementById('input' + index).focus();
      return true;
    }
    setTimeout(() => {
      index++;
      if (document.getElementById('input' + index))
        document.getElementById('input' + index).focus();



    }, 1)
    return true;
  }

  reset(){
    this.ismobilenumber=false;
    this.MobileNumberForm.get("mobile").setValue('');
  }


}
