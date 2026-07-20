import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ICategory } from '@shared/models/Category';
import { environment } from '../../../environments/environment.development';
import { IGetProduct } from '@shared/models/Product';
import { FileValidators } from '@shared/validators/filevalidators';
import { ProductService } from '@shared/services/product-service';
import { CategoryService } from '@shared/services/category-service';

@Component({
  selector: 'app-addproduct',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addproduct.html',
  styleUrl: './addproduct.scss',
})
export class AddProduct implements OnInit {
  productId: string | null = null;
  categories: ICategory[] = [];
  formGroup!: FormGroup;
  isUpdate: boolean = false;
  imagePreview: string | null = null;
  imagePath: string | null = null;

  urlImages: string = environment.urlImages;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _route: Router,
    private _location: Location,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _fb: FormBuilder,
    private _toaService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formValidation();
    this.getAllCategories();

    this._activeRoute.paramMap.subscribe((params) => {
      var id = params.get('id');
      if (id) {
        this._productService.getById(id).subscribe({
          next: (response) => {
            this.isUpdate = true;
            this.productId = response.data.id;
            this.imagePath = response.data.imagePath;

            const category = this.categories.find(
              (c) => c.name === response.data.categoryName
            );

            this.formGroup.patchValue({
              name: response.data.name,
              description: response.data.description,
              price: response.data.price,
              categoryId: category ? category.id : null,
            });

            if (response.data.imagePath) {
              this.imagePreview = this.urlImages + response.data.imagePath;
            }
          },
          error: () => {
            this._toaService.error('Failed to load product', 'Error');
          },
        });
      }
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
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      price: ['', [Validators.required, Validators.min(1)]],
      categoryId: ['', [Validators.required]],
      image: [
        null,
        [
          FileValidators.maxFileSize(5),
          FileValidators.allowedExtensions(['.jpg', '.jpeg', '.png', '.webp']),
        ],
      ],
    });
  }

  // Getters
  get _name() {
    return this.formGroup.get('name');
  }
  get _description() {
    return this.formGroup.get('description');
  }
  get _price() {
    return this.formGroup.get('price');
  }
  get _categoryId() {
    return this.formGroup.get('categoryId');
  }
  get _image() {
    return this.formGroup.get('image');
  }

  getAllCategories() {
    this._categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: () => {
        this._toaService.error('Failed to load categories', 'Error');
      },
    });
  }

  goBack() {
    this._location.back();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.formGroup.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(img: any) {
    this.formGroup.patchValue({ image: null });
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = new FormData();
      formData.append('Name', this.formGroup.get('name')?.value);
      formData.append('Description', this.formGroup.get('description')?.value);
      formData.append('Price', this.formGroup.get('price')?.value);
      formData.append('CategoryId', this.formGroup.get('categoryId')?.value);

      formData.append('ImagePath', this.imagePath ?? '');

      const imageFile = this.formGroup.get('image')?.value;
      if (imageFile) {
        formData.append('Image', imageFile);
      }

      if (this.isUpdate && this.productId) {
        formData.append('Id', this.productId);
        this._productService.update(formData).subscribe({
          next: () => {
            this._toaService.success('تم تحديث المنتج بنجاح', 'نجاح');
            this._route.navigate(['/admin/product']);
          },
          error: (er) => this._toaService.error(er.error.message, 'خطأ'),
        });
      } else {
        this._productService.create(formData).subscribe({
          next: () => {
            this._toaService.success('تم اضافه المنتج بنجاح', 'نجاح');
            this._route.navigate(['/admin/product']);
          },
          error: (er) => this._toaService.error(er.error.message, 'خطأ'),
        });
      }
    }
  }
}
