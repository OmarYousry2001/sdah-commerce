import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IBasket } from '@shared/models/Basket';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { BasketService } from '../basketComponent/basketservice';
import { SettingsService } from '@shared/services/settings-service';
import { ISettings } from '@shared/models/Settings';
import { environment } from '@shared/environments/environment.development';

@Component({
  selector: 'app-header',
  imports: [
    RouterLinkActive,
    CommonModule,
    RouterLink,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false;
  count!: Observable<IBasket | null>;
  num: number = 0;
  settings!: ISettings;
  urlImages = environment.urlImages;
  constructor(
    private _basketService: BasketService,
    private _settingsService: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCountBasket();
    this.getSettings();
    this.getBasket();
    // this.startLogoRotation();
  }

  getCountBasket() {
    const basketId = localStorage.getItem('basketId');
    this.count = this._basketService.basket$;
    if (basketId) {
    }
  }

  getBasket() {
    const basketId = localStorage.getItem('basketId');
    if (basketId) {
      this._basketService.GetBasket(basketId).subscribe({
        next: (value) => {
          this.count = this._basketService.basket$;
        },
        error(er) {
          console.log(er);
        },
      });
    }
  }

  getSettings() {
    this._settingsService.getAll().subscribe({
      next: (value) => {
        this.settings = value.data[0];
      },
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
