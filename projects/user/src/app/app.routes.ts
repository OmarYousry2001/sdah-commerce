import { Routes } from '@angular/router';
import { Home } from './homeComponent/home';

export const routes: Routes = [
  { path: '', component: Home },

  {
    path: 'product',
    loadComponent: () =>
      import('./productComponent/product').then((c) => c.Product),
  },
  {
    path: 'productItem',
    loadComponent: () =>
      import('./product-itemComponent/ProductItem').then((c) => c.ProductItem),
  },
  {
    path: 'productDetails/:id',
    loadComponent: () =>
      import('./product-detailsComponent/productdetails').then(
        (c) => c.ProductDetails
      ),
  },
  {
    path: 'basket',
    loadComponent: () =>
      import('./basketComponent/basket/basket').then((c) => c.Basket),
  },

  {
    path: 'aboutUs',
    loadComponent: () => import('./aboutComponent/about').then((c) => c.About),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contactComponent/contact').then((c) => c.Contact),
  },

  { path: '**', redirectTo: '' },
];
