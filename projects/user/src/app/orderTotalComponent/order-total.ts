import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IBasketTotal } from '@shared/models/Basket';
import { BasketService } from '../basketComponent/basketservice';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@shared/services/settings-service';
import { ISettings } from '@shared/models/Settings';

@Component({
  selector: 'app-order-total',
  imports: [CommonModule],
  templateUrl: './order-total.html',
  styleUrl: './order-total.scss',
})
export class OrderTotal implements OnInit {
  basketTotals!: IBasketTotal;

  @Output() flag = new EventEmitter<boolean>();

  constructor(private _basketService: BasketService) {}
  ngOnInit(): void {
    this.loadTotalSummary();
  }

  loadTotalSummary() {
    this._basketService.basketTotal$.subscribe({
      next: (value) => {
        if (!value) return;
        this.basketTotals = value;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  sendFlag() {
    this.flag.emit(true);
  }
}
