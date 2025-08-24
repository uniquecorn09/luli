import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  /** Replace with a real user profile photo URL when available */
  profileImageUrl: string = 'assets/bg.png';

  constructor(private router: Router) {}

  logout() {
    // Clear access token from localStorage
    localStorage.removeItem('accessToken');
    // Navigate to login page
    this.router.navigateByUrl('/login');
  }
}
