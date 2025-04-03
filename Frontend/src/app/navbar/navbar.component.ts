import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string | null = null;
  isNavbarOpen: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log('isLoggedIn:', this.isLoggedIn); // Debugging statement

    if (this.isLoggedIn) {
      this.authService.getRole().subscribe((data: any) => {
        this.role = data.role;
        console.log('Role in ngOnInit:', this.role); // Debugging statement
      });
    }
    this.loadNavbarToggleScript();
  }

  loadNavbarToggleScript(): void {
    const script = document.createElement('script');
    script.textContent = `
      document.addEventListener('DOMContentLoaded', function () {
        var navbarToggler = document.querySelector('.navbar-toggler');
        var navbarCollapse = document.querySelector('.navbar-collapse');

        navbarToggler.addEventListener('click', function () {
          navbarCollapse.classList.toggle('show');
        });
      });
    `;
    document.body.appendChild(script);
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.role = null;
    this.router.navigate(['/']);
  }
}
