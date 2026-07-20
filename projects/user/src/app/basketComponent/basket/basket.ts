import { Component, HostListener, OnInit } from '@angular/core';
import { environment } from '@shared/environments/environment.development';
import { BasketService } from '../basketservice';
import { IBasket, IBasketItem } from '@shared/models/Basket';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderTotal } from '../../orderTotalComponent/order-total';
import { ISettings } from '@shared/models/Settings';
import { SettingsService } from '@shared/services/settings-service';

@Component({
  selector: 'app-basket',
  imports: [CommonModule, RouterLink, OrderTotal],
  templateUrl: './basket.html',
  styleUrl: './basket.scss',
})
export class Basket implements OnInit {
  urlImages = environment.urlImages;
  Settings!: ISettings;
  basket!: IBasket;
  flag: boolean = false;
  constructor(
    private _basketService: BasketService,
    private _settingsService: SettingsService
  ) {}
  ngOnInit(): void {
    this.getBasket();
  }
  toggleModal = function () {
    document.querySelector('.overlay')?.classList.toggle('hidden');
    document.querySelector('.modals')?.classList.toggle('hidden');
  };
  getBasket() {
    this._basketService.basket$.subscribe({
      next: (value) => {
        this.basket = value!;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.loadSettings();
  }
  RemoveBasket(item: IBasketItem) {
    this._basketService.removeItemFormBasket(item);
  }
  incrementQuantity(item: IBasketItem) {
    this._basketService.incrementBasketItemQuantity(item);
  }
  DecrementQuantity(item: IBasketItem) {
    this._basketService.DecrementBasketItemQuantity(item);
  }
  receiveFlag(flagReceive: boolean) {
    this.flag = flagReceive;
    if (this.flag === false) return;
    this.toggleModal();
  }

  loadSettings() {
    this._settingsService.getAll().subscribe({
      next: (response) => {
        if (response.data.length === 0) return;
        this.Settings = response.data[0];
      },
    });
  }
  closeModal() {
    this.toggleModal();
  }

  clickWatsApp() {
    if (!this.basket) return;
    this._basketService.deleteBasketItem(this.basket);
  }
}
