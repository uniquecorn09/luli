import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../services/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule],
  templateUrl: './wishlist.html',
  styleUrls: ['../product-list/product-list.scss'],
})
export class Wishlist implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private productService: ProductService,
    public auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    this.http.get<any[]>(environment.apiBaseUrl + '/wishlist').subscribe({
      next: (items) => {
        this.products = items.map((item) => ({
          ...item.product,
          proposed: item.proposed,
          _id: item._id,
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Wunschliste konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  markPurchased(tonieId: string) {
    this.productService.markPurchased(tonieId, true).subscribe({
      next: () => this.loadWishlist(),
      error: () => alert('Fehler beim Markieren als gekauft'),
    });
  }

  removeFromWishlist(tonieId: string) {
    this.productService.removeFromWishlist(tonieId).subscribe({
      next: () => this.loadWishlist(),
      error: () => alert('Fehler beim Entfernen aus der Wunschliste'),
    });
  }

  acceptProposal(itemId: string) {
    this.productService.acceptWishlistProposal(itemId).subscribe({
      next: () => this.loadWishlist(),
      error: () => alert('Fehler beim Annehmen des Vorschlags'),
    });
  }

  rejectProposal(itemId: string) {
    this.productService.rejectWishlistProposal(itemId).subscribe({
      next: () => this.loadWishlist(),
      error: () => alert('Fehler beim Ablehnen des Vorschlags'),
    });
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
