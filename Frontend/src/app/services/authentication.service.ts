import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(email: string, password: string): Observable<any> {
    console.log('Login button clicked');

    return this.http
      .post<any>('http://localhost:8000/api/login', { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.cookieService.set('token', response.token);
          }
        })
      );
  }

  logout() {
    this.cookieService.delete('token');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('token');
  }

  getRole(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/api/role', {
      withCredentials: true,
    });
  }
}
