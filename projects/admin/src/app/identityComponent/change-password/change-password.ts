import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IdentityService } from '@shared/services/identity-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {
  formGroup!: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showPasswordConfirmation = false;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toaService: ToastrService,
    private _identityService: IdentityService
  ) {}
  ngOnInit(): void {
    this.formValidation();
  }
  formValidation() {
    this.formGroup = this._fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
            ),
          ],
        ],
        passwordConfirmation: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const passwordConfirmation = formGroup.get('passwordConfirmation')?.value;
    return newPassword === passwordConfirmation ? null : { mismatch: true };
  }

  get _currentPassword() {
    return this.formGroup.get('currentPassword');
  }

  get _newPassword() {
    return this.formGroup.get('newPassword');
  }

  get _passwordConfirmation() {
    return this.formGroup.get('passwordConfirmation');
  }

  submit() {
    this._identityService.ChangePassword(this.formGroup.value).subscribe({
      next: (value) => {
        this._toaService.success(value.message, 'نجاح');

        this._router.navigateByUrl('/admin');
      },
      error: (err: any) => {
        console.log(err);
        this._toaService.error(err.error.message, 'خطاء');
      },
    });
  }
}
