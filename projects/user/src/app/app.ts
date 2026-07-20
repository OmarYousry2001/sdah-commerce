import { Component, signal } from '@angular/core';

import { Home } from './homeComponent/home';
import { Header } from './headerComponent/header';
import { Footer } from './footerComponent/footer';
import { RouterOutlet } from '@angular/router';
import { Product } from './productComponent/product';

@Component({
  selector: 'app-root',
  imports: [Home, Header, Footer, RouterOutlet, Product],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('user');
}
