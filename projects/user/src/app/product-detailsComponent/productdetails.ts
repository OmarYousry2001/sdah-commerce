import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@shared/environments/environment.development';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { BasketService } from '../basketComponent/basketservice';
import { IGetProduct } from '@shared/models/Product';
import { ProductService } from '@shared/services/product-service';

import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ProductDetails',
  imports: [NgxImageZoomModule, CommonModule],
  templateUrl: './ProductDetails.html',
  styleUrl: './productDetails.scss',
})
export class ProductDetails {
  quantity: number = 1;
  loading: boolean = false;
  product!: IGetProduct;
  MainImage!: string;
  urlImages = environment.urlImages;
  constructor(
    private _productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private basketService: BasketService
  ) {}
  ngOnInit(): void {
    this.loadProduct();
  }
  loadProduct() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;
      this._productService.getById(id).subscribe({
        next: (value) => {
          this.product = value.data;
          this.MainImage = this.product.imagePath;
        },
      });
    });
  }

  ReplaceImage(src: string) {
    this.MainImage = src;
  }
  incrementBasket() {
    this.quantity++;
    this.toast.success('تمت إضافة المنتج إلى السلة', 'تم بنجاح');
  }

  DecrementBasket() {
    if (this.quantity > 1) {
      this.quantity--;
      this.toast.warning('تم تقليل عدد المنتجات', 'تنبيه');
    } else {
      this.toast.error('لا يمكنك تقليل العدد لأقل من 1 منتج', 'خطأ');
    }
  }
  AddToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
    this.toast.success('تمت إضافة المنتج إلى السلة', 'تم بنجاح');
  }
  CalculateDiscount(oldPrice: number, newPrice: number): number {
    return parseFloat(
      Math.round(((oldPrice - newPrice) / oldPrice) * 100).toFixed(1)
    );
  }
}
