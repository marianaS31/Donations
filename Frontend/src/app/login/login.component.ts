import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (data) => {
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.router.navigate(['/']);
      },
      (error) => {
        this.errorMessage = 'Invalid login credentials';
      }
    );
  }
}
