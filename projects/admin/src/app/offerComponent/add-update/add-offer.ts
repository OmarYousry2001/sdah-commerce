import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@shared/environments/environment.development';
import { IGetProduct } from '@shared/models/Product';
import { OfferService } from '@shared/services/offer-service';
import { ProductService } from '@shared/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { FileValidators } from '@shared/validators/filevalidators';
import { BaseSearchCriteriaModel } from '@shared/models/ProductParam';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-offer',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-offer.html',
  styleUrl: './add-offer.scss',
})
export class AddOffer implements OnInit {
  offerId: string | null = null;
  products: IGetProduct[] = [];
  formGroup!: FormGroup;
  isUpdate: boolean = false;
  imagePreview: string | null = null;
  imagePath!: string;
  urlImages: string = environment.urlImages;
  searchCriteria = new BaseSearchCriteriaModel();

  constructor(
    private _activeRoute: ActivatedRoute,
    private _route: Router,
    private _location: Location,
    private _offerService: OfferService,
    private _productService: ProductService,
    private _fb: FormBuilder,
    private _toaService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formValidation();

    this._activeRoute.paramMap.subscribe((params) => {
      var id = params.get('id');
      if (id) {
        this._offerService.getById(id).subscribe({
          next: (response) => {
            this.isUpdate = true;
            const data = response.data ?? response;
            this.offerId = data.id;
            this.imagePath = data.imagePath ?? '';

            this.formGroup.patchValue({
              name: data.name,
              discountedPrice: data.discountedPrice,
              description: data.description,
              productIds: data.products?.map((p: any) => p.id) || [],
            });

            if (data.imagePath) {
              this.imagePreview = this.urlImages + data.imagePath;
            }

            this.loadProducts();
          },
          error: () => {
            this._toaService.error('فشل في تحميل العرض', 'خطأ');
          },
        });
      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts() {
    this._productService.getAllWithPagination(this.searchCriteria).subscribe({
      next: (response) => {
        this.products = response.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this._toaService.error('فشل تحميل المنتجات', 'خطأ');
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
      discountedPrice: ['', [Validators.required, Validators.min(1)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      productIds: [[], [Validators.required]],
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
  get _discountedPrice() {
    return this.formGroup.get('discountedPrice');
  }
  get _description() {
    return this.formGroup.get('description');
  }
  get _productIds() {
    return this.formGroup.get('productIds');
  }
  get _image() {
    return this.formGroup.get('image');
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

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = new FormData();
      formData.append('Name', this.formGroup.get('name')?.value);
      formData.append(
        'DiscountedPrice',
        this.formGroup.get('discountedPrice')?.value
      );
      formData.append('Description', this.formGroup.get('description')?.value);
      formData.append('ImagePath', this.imagePath ?? '');

      const imageFile = this.formGroup.get('image')?.value;
      if (imageFile) {
        formData.append('Image', imageFile);
      }

      const productIds = this.formGroup.get('productIds')?.value || [];
      productIds.forEach((id: string) => {
        formData.append('ProductIds', id);
      });

      if (this.isUpdate && this.offerId) {
        formData.append('Id', this.offerId);

        this._offerService.update(formData).subscribe({
          next: () => {
            this._toaService.success('تم تحديث العرض بنجاح', 'نجاح');
            this._route.navigate(['/admin/offer']);
          },
          error: (er) => this._toaService.error(er.error.message, 'خطأ'),
        });
      } else {
        this._offerService.create(formData).subscribe({
          next: () => {
            this._toaService.success('تم إضافة العرض بنجاح', 'نجاح');
            this._route.navigate(['/admin/offer']);
          },
          error: (er) => this._toaService.error(er.error.message, 'خطأ'),
        });
      }
    }
  }

  nextPage() {
    this.searchCriteria.pageNumber++;
    this.loadProducts();
  }

  previousPage() {
    if (this.searchCriteria.pageNumber > 1) {
      this.searchCriteria.pageNumber--;
      this.loadProducts();
    }
  }

  //  Handle selected products
  toggleProductSelection(productId: string, event: any) {
    const selectedProducts = this.formGroup.get('productIds')?.value || [];

    if (event.target.checked) {
      // Add product if not already selected
      if (!selectedProducts.includes(productId)) {
        selectedProducts.push(productId);
      }
    } else {
      // Remove product if unchecked
      const index = selectedProducts.indexOf(productId);
      if (index > -1) {
        selectedProducts.splice(index, 1);
      }
    }

    this.formGroup.patchValue({ productIds: selectedProducts });
  }
}
