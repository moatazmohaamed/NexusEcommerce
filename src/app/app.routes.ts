import { ForgotPassComponent } from './pages/forgot/forgot-pass/forgot-pass.component';
import { loggedGuard } from './core/guards/logged.guard';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { Routes, Route } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';
import { RenderMode } from '@angular/ssr';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthComponent,
    canActivate: [loggedGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((c) => c.LoginComponent),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        title: 'Register',
      },

      {
        path: 'forgot',
        loadComponent: () =>
          import('./pages/forgot/forgot-pass/forgot-pass.component').then(
            (c) => c.ForgotPassComponent
          ),
        title: 'Forgot Password',
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,

    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => c.HomeComponent),
        title: 'Home',
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/cart/cart.component').then((c) => c.CartComponent),
        title: 'Cart',
      },
      {
        path: 'allorders',
        loadComponent: () =>
          import('./shared/components/buisness/order/order.component').then(
            (c) => c.OrderComponent
          ),
        title: 'Cart',
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account/account.component').then(
            (c) => c.AccountComponent
          ),
        title: 'My Account',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products.component').then(
            (c) => c.ProductsComponent
          ),
        title: 'Products',
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./pages/brands/brands.component').then(
            (c) => c.BrandsComponent
          ),
        title: 'Brands',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
        title: 'Categories',
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./pages/checkout/checkout.component').then(
            (c) => c.CheckoutComponent
          ),
        title: 'Checkout',
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./pages/details/details.component').then(
            (c) => c.DetailsComponent
          ),
        title: 'details',
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./pages/wishlist/wishlist.component').then(
            (c) => c.WishlistComponent
          ),
        title: 'Favourites',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/notfound/notfound.component').then(
            (c) => c.NotfoundComponent
          ),
        title: 'Error 404',
      },
    ],
  },
];
