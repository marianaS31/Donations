import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const allowedUrls = [
      '/',
      '/entidades',
      '/profile/register',
      '/login',
      '/entidade/register',
    ];

    if (this.cookieService.check('token')) {
      return true;
    }

    if (allowedUrls.includes(state.url)) {
      return true; // Allow access to specific public pages
    }

    this.router.navigate(['/']); // Redirect to root
    return false;
  }
}
