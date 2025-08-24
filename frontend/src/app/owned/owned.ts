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
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-owned',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule],
  templateUrl: './owned.html',
  styleUrls: ['../product-list/product-list.scss'],
})
export class Owned implements OnInit {
  items: { product: Product; pending?: boolean }[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    public auth: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOwned();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  loadOwned(): void {
    this.loading = true;
    this.http.get<any[]>(environment.apiBaseUrl + '/owned').subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Besitz-Liste konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  removeOwned(tonieId: string) {
    this.productService.removeOwned(tonieId).subscribe({
      next: () => {
        this.loadOwned();
        this.notificationService.show('Aus Besitz-Liste entfernt', 'success');
      },
      error: () => {
        this.notificationService.show(
          'Fehler beim Entfernen aus Besitz-Liste',
          'error'
        );
      },
    });
  }

  setNotPending(tonieId: string) {
    this.productService.setOwnedNotPending(tonieId).subscribe({
      next: () => {
        this.loadOwned();
        this.notificationService.show('Besitz-Status aktualisiert', 'success');
      },
      error: () => {
        this.notificationService.show(
          'Fehler beim Aktualisieren des Besitz-Status',
          'error'
        );
      },
    });
  }
}
