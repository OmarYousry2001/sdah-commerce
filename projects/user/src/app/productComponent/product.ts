import {
  Component,
  ElementRef,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { ICategory } from '@shared/models/Category';
import { IGetProduct, IProduct } from '@shared/models/Product';
import { CategoryService } from '@shared/services/category-service';
import { ProductService } from '@shared/services/product-service';
import { BaseSearchCriteriaModel } from '@shared/models/ProductParam';
import { OrderingEnum } from '@shared/models/OrderingEnum';
import { IPaginatedResult } from '@shared/models/PaginatedResult';
import { ProductItem } from '../product-itemComponent/ProductItem';
@Component({
  selector: 'app-product',
  imports: [FormsModule, CommonModule, PaginationComponent, ProductItem],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product implements OnInit {
  product!: IGetProduct[];
  Category!: ICategory[];
  TotalCount: number = 0;
  ProductParam = new BaseSearchCriteriaModel();
  searchInputValue: string = '';

  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getAllProduct();
    this.getCategory();
  }

  getAllProduct() {
    this._productService.getAllWithPagination(this.ProductParam).subscribe({
      next: (value: IPaginatedResult<IGetProduct>) => {
        this.product = value.data;
        this.TotalCount = value.totalCount;
        this.ProductParam.pageNumber = value.currentPage;
        this.ProductParam.pageSize = value.pageSize;
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  getCategory() {
    this._categoryService.getAll().subscribe({
      next: (value) => {
        this.Category = value.data;
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  SortingByPrice(sort: Event) {
    const value = Number((sort.target as HTMLSelectElement).value);
    this.ProductParam.orderingEnum =
      value !== 0 ? (value as OrderingEnum) : null;
    this.getAllProduct();
  }

  SortingOption = [
    { name: 'السعر', value: 0 },
    { name: 'اقل سعر', value: OrderingEnum.PriceAce },
    { name: 'اعلي سعر', value: OrderingEnum.PriceDce },
  ];

  SelectedId(categoryId: string | null) {
    this.ProductParam.categoryId = categoryId;
    this.ProductParam.pageNumber = 1;
    this.getAllProduct();
  }

  OnSearch(Search: string) {
    this.ProductParam.searchTerm = Search;
    this.getAllProduct();
  }

  @ViewChild('search') searchInput!: ElementRef; // Reference to the search input element
  @ViewChild('SortSelected') selected!: ElementRef; // Reference to the sorting select element

  // Reset all values
  ResetValue() {
    this.ProductParam.searchTerm = '';
    this.ProductParam.orderingEnum = null;
    this.ProductParam.categoryId = null;
    this.ProductParam.pageNumber = 1;
    this.getAllProduct();

    this.searchInputValue = '';
    this.searchInput.nativeElement.value = '';

    this.selected.nativeElement.selectedIndex = 0;
  }

  OnChangePage(page: any) {
    this.ProductParam.pageNumber = page;
    this.getAllProduct();
  }
}
