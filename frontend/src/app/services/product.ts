import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface Product {
  tonieId: string;
  name: string;
  imageUrl?: string;
  productUrl?: string;
  availability: 'in_stock' | 'out_of_stock' | 'unknown';
  price?: number | string;
  proposed?: boolean;
  _id?: string;
}

export interface ProductPage {
  data: Product[];
  page: number;
  totalPages: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiBaseUrl + '/products';

  constructor(private http: HttpClient) {}

  getProducts(page = 1, search?: string): Observable<ProductPage> {
    let url = `${this.apiUrl}?page=${page}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<ProductPage>(url);
  }

  addToWishlist(tonieId: string) {
    return this.http.post(`${environment.apiBaseUrl}/wishlist/${tonieId}`, {
      action: 'add',
    });
  }

  proposeWishlist(tonieId: string) {
    return this.http.post(
      `${environment.apiBaseUrl}/wishlist/propose/${tonieId}`,
      {}
    );
  }

  markPurchased(tonieId: string, pending: boolean) {
    return this.http.post(`${environment.apiBaseUrl}/owned/${tonieId}`, {
      action: 'add',
      pending: pending,
    });
  }

  removeFromWishlist(tonieId: string) {
    return this.http.post(`${environment.apiBaseUrl}/wishlist/${tonieId}`, {
      action: 'remove',
    });
  }

  removeOwned(tonieId: string) {
    return this.http.post(
      `${environment.apiBaseUrl}/owned/${tonieId}/remove`,
      {}
    );
  }

  setOwnedNotPending(tonieId: string) {
    return this.http.post(
      `${environment.apiBaseUrl}/owned/${tonieId}/set-pending`,
      {}
    );
  }

  getWishlistIds(): Observable<string[]> {
    return this.http
      .get<any[]>(environment.apiBaseUrl + '/wishlist')
      .pipe(
        map((items) =>
          items
            .filter((item) => !item.proposed)
            .map((item) => item.product.tonieId)
        )
      );
  }

  getOwnedIds(): Observable<string[]> {
    return this.http
      .get<any[]>(environment.apiBaseUrl + '/owned')
      .pipe(
        map((items) =>
          items
            .filter((item) => !item.pending)
            .map((item) => item.product.tonieId)
        )
      );
  }

  acceptWishlistProposal(id: string) {
    return this.http.patch(
      `${environment.apiBaseUrl}/wishlist/${id}/accept`,
      {}
    );
  }

  rejectWishlistProposal(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/wishlist/${id}`);
  }
}
