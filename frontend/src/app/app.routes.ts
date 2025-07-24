import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list';
import { Wishlist } from './wishlist/wishlist';
import { Owned } from './owned/owned';
import { Profile } from './profile/profile';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'wishlist', component: Wishlist },
  { path: 'owned', component: Owned },
  { path: 'profile', component: Profile },
  { path: 'login', component: Login },
];
