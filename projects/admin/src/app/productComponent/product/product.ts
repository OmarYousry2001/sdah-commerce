import { ChangeDetectorRef, Component } from '@angular/core';
import { IGetProduct } from '@shared/models/Product';
import { ProductService } from '@shared/services/product-service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-product',
  imports: [RouterLink, CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  products: IGetProduct[] = [];
  urlImages: string = environment.urlImages;
  constructor(
    private _productservice: ProductService,
    private _toaService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this._productservice.getAll().subscribe({
      next: (response) => {
        this.products = response.data;
        console.log(response.data);
        //  this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this._toaService.error('Failed to load products', 'Error');
      },
    });
  }

  deleteCategory(id: string) {
    this._productservice.Delete(id).subscribe({
      next: (response) => {
        this.products = this.products.filter((c) => c.id !== id);
        this._toaService.success(response.message, 'Success');
      },
      error: (err) => {
        console.log(err);
        this._toaService.error('Failed to delete category', 'Error');
      },
    });
  }
}
