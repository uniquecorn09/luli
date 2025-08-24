import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService, 
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Erfolgreich angemeldet!');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.error = 'Login fehlgeschlagen';
        this.loading = false;
        this.notificationService.error('Login fehlgeschlagen');
      },
    });
  }
}
