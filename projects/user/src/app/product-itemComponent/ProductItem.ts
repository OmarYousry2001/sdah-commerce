import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IGetProduct, IProduct } from '@shared/models/Product';
import { BasketService } from '../basketComponent/basketservice';
import { environment } from '@shared/environments/environment.development';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ProductItem',
  imports: [CommonModule, RouterLink],
  templateUrl: './ProductItem.html',
  styleUrl: './ProductItem.scss',
})
export class ProductItem {
  @Input() Product!: IGetProduct;
  urlImages = environment.urlImages;

  constructor(private _basketService: BasketService) {}

  SetBasketValue() {
    this._basketService.addItemToBasket(this.Product);
  }
}
