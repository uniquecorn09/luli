import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService, Product } from '../services/product';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  totalPages = 1;
  wishlistIds: string[] = [];
  ownedIds: string[] = [];
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    public auth: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts(1, false);
    this.loadWishlistIds();
    this.loadOwnedIds();
  }

  loadProducts(page = 1, restoreScroll = false, search?: string): void {
    this.loading = true;
    this.productService.getProducts(page, search ?? this.searchTerm).subscribe({
      next: (res) => {
        this.products = res.data;
        this.currentPage = res.page;
        this.totalPages = res.totalPages;
        this.loading = false;
        if (restoreScroll) {
          this.restoreScrollPosition();
        }
      },
      error: (err) => {
        this.error = 'Produkte konnten nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  loadWishlistIds() {
    this.productService.getWishlistIds().subscribe((ids) => {
      this.wishlistIds = ids;
    });
  }

  loadOwnedIds() {
    this.productService.getOwnedIds().subscribe((ids) => {
      this.ownedIds = ids;
    });
  }

  isOnWishlist(tonieId: string): boolean {
    return this.wishlistIds.includes(tonieId);
  }

  isOwned(tonieId: string): boolean {
    return this.ownedIds.includes(tonieId);
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadProducts(this.currentPage - 1, false);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadProducts(this.currentPage + 1, false);
    }
  }

  onPageSelect(event: any) {
    const page = Number(event.target.value);
    if (page && page !== this.currentPage) {
      this.loadProducts(page, false);
    }
  }

  addToWishlist(tonieId: string) {
    this.saveScrollPosition();
    this.productService.addToWishlist(tonieId).subscribe({
      next: () => {
        this.loadProducts(this.currentPage, true);
        this.notificationService.success('Zur Wunschliste hinzugefügt!');
      },
      error: (err) => {
        if (err.status === 401) {
          this.notificationService.warning('Bitte zuerst einloggen!');
        } else {
          this.notificationService.error(
            'Fehler beim Hinzufügen zur Wunschliste'
          );
        }
      },
    });
  }

  removeFromWishlist(tonieId: string) {
    this.saveScrollPosition();
    this.productService.removeFromWishlist(tonieId).subscribe({
      next: () => {
        this.loadProducts(this.currentPage, true);
        this.notificationService.success('Von der Wunschliste entfernt!');
      },
      error: (err) => {
        if (err.status === 401) {
          this.notificationService.warning('Bitte zuerst einloggen!');
        } else {
          this.notificationService.error(
            'Fehler beim Entfernen aus der Wunschliste'
          );
        }
      },
    });
  }

  proposeWishlist(tonieId: string) {
    this.productService.proposeWishlist(tonieId).subscribe({
      next: () => this.notificationService.success('Vorschlag gesendet!'),
      error: () =>
        this.notificationService.error(
          'Fehler beim Vorschlagen für die Wunschliste'
        ),
    });
  }

  markPurchased(tonieId: string) {
    this.saveScrollPosition();
    this.productService.markPurchased(tonieId, false).subscribe({
      next: () => {
        this.loadProducts(this.currentPage, true);
        this.notificationService.success('Als gekauft markiert!');
      },
      error: () =>
        this.notificationService.error('Fehler beim Markieren als gekauft'),
    });
  }

  onSearch() {
    this.loadProducts(1, false, this.searchTerm);
  }

  saveScrollPosition() {
    localStorage.setItem('productListScroll', String(window.scrollY));
  }

  restoreScrollPosition() {
    const scroll = localStorage.getItem('productListScroll');
    if (scroll) {
      setTimeout(() => window.scrollTo(0, +scroll), 0);
      localStorage.removeItem('productListScroll');
    }
  }
}
