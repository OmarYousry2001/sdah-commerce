import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '@shared/services/category-service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addcategory',
  imports: [ReactiveFormsModule],
  templateUrl: './addcategory.html',
  styleUrl: './addcategory.scss',
})
export class Addcategory {
  CategoryId: string | null = null;
  formGroup!: FormGroup;

  name: string = '';
  constructor(
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _route: Router,
    private _categoryService: CategoryService,
    private _toaService: ToastrService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      var id = params.get('id');
      console.log('ngOnInit', id);
      if (id) {
        this._categoryService.getById(id).subscribe({
          next: (response) => {
            this.CategoryId = response.data.id;
            this.formGroup.patchValue({
              name: response.data.name,
            });

            this.name = response.data.name;
          },
          error: (err) => {
            this._toaService.error('Failed to load category', 'Error');
          },
        });
      }
    });

    this.formValidation();
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
    });
  }
  get _name() {
    return this.formGroup.get('name');
  }

  goBack() {
    this._location.back();
  }

  onSubmit() {
    if (this.CategoryId) {
      this.formGroup.value.id = this.CategoryId;

      this._categoryService.update(this.formGroup.value).subscribe({
        next: (response) => {
          this._toaService.success('تم تحديث  بنجاح', 'نجاح');
          this._route.navigateByUrl('/admin/category');
        },
        error: (err) => {
          console.log(err);
          this._toaService.error('فشل في تحديث ', 'خطأ');
        },
      });
    } else {
      this._categoryService.create(this.formGroup.value).subscribe({
        next: (response) => {
          this._toaService.success('تم الاضافه  بنجاح', 'نجح');
          this._route.navigateByUrl('/admin/category');
        },
        error: (err) => {
          console.log(err);
          this._toaService.error('فشل في الاضافه ', 'خطأ');
        },
      });
    }
  }
}
