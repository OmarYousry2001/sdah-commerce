import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { ISettings } from '@shared/models/Settings';
import { SettingsService } from '@shared/services/settings-service';
import { CommentService } from '@shared/services/comment-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  Settings!: ISettings;
  formGroup!: FormGroup;
  constructor(
    private _settingsService: SettingsService,
    private _fb: FormBuilder,
    private _commentService: CommentService,
    private _route: Router,
    private _toaService: ToastrService
  ) {}
  ngOnInit(): void {
    this.loadSettings();
    this.formValidation();
  }

  loadSettings() {
    this._settingsService.getAll().subscribe({
      next: (response) => {
        if (response.data.length === 0) return;
        this.Settings = response.data[0];
      },
    });
  }
  formValidation() {
    this.formGroup = this._fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^01[0-2,5][0-9]{8}$/)],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
    });
  }
  get _name() {
    return this.formGroup.get('name');
  }
  get _phone() {
    return this.formGroup.get('phone');
  }
  get _message() {
    return this.formGroup.get('message');
  }

  onSubmit() {
    return this._commentService.create(this.formGroup.value).subscribe({
      next: () => {
        this._toaService.success('تم ارسال التعليق بنجاح', 'نجاح');
        this._route.navigateByUrl('/');
      },
      error: (er) => {
        this._toaService.error('فشل في ارسال التعليق ', 'خطأ');
      },
    });
  }
}
