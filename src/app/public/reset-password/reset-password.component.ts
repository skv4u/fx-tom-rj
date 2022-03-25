import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PorcastService } from 'src/app/private/porcast.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [FormBuilder]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isresetFormValid: boolean = true;
  isProgressing: boolean = false;
  constructor(
    public fb: FormBuilder, public _webService: WebService, public router: Router, public toaster: ToastService, public _commonService: CommonService, public _podService: PorcastService) { }
  ngOnInit() {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    })
  }
  resertpassword() {
    if (this.resetForm.value.newPassword == this.resetForm.value.confirmPassword) {
      this.toaster.error('Invalid password');
    }
    if (!this.resetForm.valid) {
      this.isresetFormValid = false;
      return
    }
    let req = {
      "phone": this._podService.mobileNumber,
      "password": this.resetForm.value.newPassword
    }
    this._podService.loader = true;
    this._webService.commonMethod('user/resetpassword', req, "POST").subscribe(
      data => {
        this._podService.loader = false;
        if (data.Status == 'Success' && data.Response) {
          this.toaster.success("Password changed successfully");
          this.router.navigate(['/', "/login"])
        } else {

        }
      })
  }
}
