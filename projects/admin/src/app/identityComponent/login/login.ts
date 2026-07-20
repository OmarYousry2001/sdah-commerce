import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { IdentityService } from '../identity-service';
import { IdentityService } from '@shared/services/identity-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  formGroup!: FormGroup;
  emailModel: string = '';
  showCurrentPassword = false;

  returnUrl: string = '';
  constructor(
    private fb: FormBuilder,
    private _identityService: IdentityService,
    private route: ActivatedRoute,
    private router: Router,
    private _toaService: ToastrService
  ) {}

  ngOnInit(): void {
    this.FormValidation();
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  FormValidation() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
          ),
        ],
      ],
      rememberMe: [false],
    });
  }

  // return FormControl
  get _email() {
    return this.formGroup.get('email');
  }
  get _password() {
    return this.formGroup.get('password');
  }
  Submit() {
    if (this.formGroup.valid) {
      this._identityService.Login(this.formGroup.value).subscribe({
        next: (response) => {
          this._toaService.success('مرحبًا بعودتك', 'تم تسجيل الدخول بنجاح');
          if (this.returnUrl) {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl(this.returnUrl);
          }

          // Redirect to returnUrl or another page after login
        },
        error: (error) => {
          this._toaService.error(
            'يرجى التحقق من البريد الإلكتروني أو كلمة المرور والمحاولة مرة أخرى',
            'فشل تسجيل الدخول'
          );
        },
      });
    }
  }
  togglePassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
}
