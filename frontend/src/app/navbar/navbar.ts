import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  menuOpen = false;
  constructor(public auth: AuthService, private router: Router) {}

  get mobileTitle(): string {
    const path = this.router.url.split('?')[0];
    if (path === '/' || path === '') return 'Wunschliste';
    if (path.startsWith('/products')) return 'Alle Tonies';
    if (path.startsWith('/owned')) return 'Hab ich schon';
    if (path.startsWith('/profile')) return 'Profil';
    if (path.startsWith('/login')) return 'Login';
    return 'Lucies Tonies';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
