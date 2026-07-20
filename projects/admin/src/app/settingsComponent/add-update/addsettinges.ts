import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { SettingsService } from '@shared/services/settings-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { FileValidators } from '@shared/validators/filevalidators';

@Component({
  selector: 'app-addsettinges',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addsettinges.html',
  styleUrl: './addsettinges.scss',
})
export class Addsettinges implements OnInit {
  settingsId!: string;
  formGroup!: FormGroup;

  logoPreviewUrl?: string;

  logoUrl?: string;
  urlImages: string = environment.urlImages;

  constructor(
    private _settingsService: SettingsService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _location: Location,
    private _toaService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      var id = params.get('id');
      if (id) {
        this.settingsId = id;
        this._settingsService.getById(id).subscribe({
          next: (response) => {
            this.formGroup.patchValue(response.data);

            if (response.data.logoPath) {
              this.logoPreviewUrl = `${this.urlImages}${response.data.logoPath}`;
              this.logoUrl = response.data.logoPath;
            }
          },
          error: (err) => {
            console.log(err);
            this._toaService.error('Failed to load settings', 'Error');
          },
        });
        this.formValidation();
      }
    });
  }
  formValidation() {
    this.formGroup = this._fb.group({
      location: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      phone1: ['', [Validators.required]],
      phone2: ['', [Validators.required]],
      landline: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      aboutMe: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      copyrightText: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      facebookLink: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],

      logo: [
        null,
        [
          FileValidators.maxFileSize(5),
          FileValidators.allowedExtensions(['.jpg', '.jpeg', '.png', '.webp']),
        ],
      ],
    });
  }

  get _locationCtrl() {
    return this.formGroup.get('location');
  }
  get _phone1() {
    return this.formGroup.get('phone1');
  }
  get _phone2() {
    return this.formGroup.get('phone2');
  }
  get _landline() {
    return this.formGroup.get('landline');
  }
  get _email() {
    return this.formGroup.get('email');
  }
  get _aboutMe() {
    return this.formGroup.get('aboutMe');
  }
  get _facebookLink() {
    return this.formGroup.get('facebookLink');
  }

  get _logo() {
    return this.formGroup.get('logo');
  }

  goBack() {
    this._location.back();
  }

  onFileSelected(event: any, controlName: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formGroup.patchValue({ [controlName]: file });
      const reader = new FileReader();

      if (file.type.startsWith('image')) {
        reader.onload = () => {
          if (controlName === 'logo') {
            this.logoPreviewUrl = reader.result as string;
            this.cdr.detectChanges();
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = new FormData();
      formData.append('Id', this.settingsId);
      formData.append('Location', this.formGroup.get('location')?.value);
      formData.append('Phone1', this.formGroup.get('phone1')?.value);
      formData.append('Phone2', this.formGroup.get('phone2')?.value);
      formData.append('Landline', this.formGroup.get('landline')?.value);

      formData.append('Email', this.formGroup.get('email')?.value);

      formData.append('AboutMe', this.formGroup.get('aboutMe')?.value);
      formData.append(
        'CopyrightText',
        this.formGroup.get('copyrightText')?.value
      );
      formData.append(
        'FacebookLink',
        this.formGroup.get('facebookLink')?.value
      );

      formData.append('LogoPath', this.logoUrl ?? '');

      const logo = this.formGroup.get('logo')?.value;
      if (logo) formData.append('Logo', logo);

      this._settingsService.update(formData).subscribe({
        next: (response) => {
          this._toaService.success('تم تحديث الإعدادات بنجاح', 'نجاح');
          this._router.navigate(['/admin/settings']);
        },
        error: (err) => {
          console.log(err);
          this._toaService.error('فشل في تحديث الإعدادات', 'خطأ');
        },
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
