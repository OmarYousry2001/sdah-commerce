import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@shared/environments/environment.development';
import { IBasket, IBasketItem, IBasketTotal } from '@shared/models/Basket';
import { IGenericResponse } from '@shared/models/GenericResponse';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IGetProduct, IProduct } from '@shared/models/Product';
import { Basket } from '@shared/models/Basket';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  BaseURL = environment.baseUrl;
  private basketSource = new BehaviorSubject<IBasket | null>(null); // for get Leasts Updates
  basket$ = this.basketSource.asObservable(); // for encapsulation – exposes read-only observable

  private basketSourceTotal = new BehaviorSubject<IBasketTotal | null>(null);
  basketTotal$ = this.basketSourceTotal.asObservable();

  constructor(private http: HttpClient) {}
  shipPrice: number = 0;

  GetBasket(id: string) {
    return this.http
      .get<IGenericResponse<IBasket>>(this.BaseURL + 'Basket/' + id)
      .pipe(
        tap((value: IGenericResponse<IBasket>) => {
          this.basketSource.next(value.data);
          this.calculateTotal();
        })
      );
  }

  SetBasket(basket: IBasket) {
    this.http
      .post<IGenericResponse<IBasket>>(this.BaseURL + 'Basket/Update', basket)
      .pipe(
        tap((value: IGenericResponse<IBasket>) => {
          this.basketSource.next(value.data);
          this.calculateTotal();
        })
      )
      .subscribe({
        error(err) {
          console.log(err);
        },
      });
  }

  getCurrentValue() {
    return this.basketSource.value;
  }

  addItemToBasket(product: IGetProduct, quantity = 1) {
    // map product to basket item
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      product,
      quantity
    );

    let basket = this.getCurrentValue();
    if (basket === null) {
      basket = this.CreateBasket();
    }
    basket.basketItems = this.addOrUpdateItem(
      basket.basketItems,
      itemToAdd,
      quantity
    );
    this.SetBasket(basket);
  }

  private addOrUpdateItem(
    basketItems: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = basketItems.findIndex((x) => x.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      basketItems.push(itemToAdd);
    } else {
      basketItems[index].quantity += quantity;
    }
    return basketItems;
  }

  // create a new basket
  private CreateBasket() {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(
    product: IGetProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imagePath: product.imagePath,
      category: product.categoryName,
      description: product.description,
    };
  }

  /**
   * Increments the quantity of a specific item in the basket by 1.
   */
  incrementBasketItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentValue();
    if (!basket) return;
    const itemIndex = basket.basketItems.findIndex((i) => i.id === item.id);
    basket.basketItems[itemIndex].quantity++;
    this.SetBasket(basket);
  }

  /**
   * Decrements the quantity of a specific item in the basket by 1.
   * If the quantity becomes 0, removes the item from the basket.
   */
  DecrementBasketItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentValue();
    if (!basket) return;
    const itemIndex = basket.basketItems.findIndex((i) => i.id === item.id);
    if (itemIndex !== -1) {
      if (basket.basketItems[itemIndex].quantity > 1) {
        basket.basketItems[itemIndex].quantity--;
        this.SetBasket(basket);
      } else {
        this.removeItemFormBasket(item);
      }
    }
  }

  /**
   * Removes an item from the basket
   * If the basket becomes empty, deletes the basket.
   */
  removeItemFormBasket(itemBasket: IBasketItem) {
    const basket = this.getCurrentValue();
    if (!basket) return;

    if (basket.basketItems.some((x) => x.id === itemBasket.id)) {
      basket.basketItems = basket.basketItems.filter(
        (i) => i.id !== itemBasket.id
      );
      if (basket.basketItems.length > 0) {
        this.SetBasket(basket);
      } else {
        this.deleteBasketItem(basket);
      }
    }
  }

  /**
   * Sends a request to delete the entire basket from the server.
   * Clears local basket data and localStorage on success.
   */
  deleteBasketItem(basket: IBasket) {
    return this.http.delete(this.BaseURL + 'Basket/' + basket.id).subscribe({
      next: (response) => {
        this.deleteBasket();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteBasket() {
    this.basketSource.next(null);
    this.basketSourceTotal.next(null);
    localStorage.removeItem('basketId');
  }
  calculateTotal() {
    const basket = this.getCurrentValue();
    if (!basket) return;

    const total = basket.basketItems.reduce((a, b) => {
      return b.price + b.quantity + a;
    }, 0);
    this.basketSourceTotal.next({ total: total });
  }
}
