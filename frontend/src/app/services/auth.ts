import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

// TODO: JWT Token Handling implementieren - Token-Validierung und Refresh
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'accessToken';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(environment.apiBaseUrl + '/login', {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.accessToken);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
