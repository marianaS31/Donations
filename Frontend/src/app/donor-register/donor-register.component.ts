import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonorService } from '../services/donor/donor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donor-register',
  templateUrl: './donor-register.component.html',
  styleUrls: ['./donor-register.component.css']
})
export class DonorRegisterComponent {
  donorForm: FormGroup;
  errorMessages: string[] = [];
  successMessage: string = '';

  constructor(private fb: FormBuilder, private donorService: DonorService,private router: Router) {
    this.donorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18)]],
      psw: ['', [Validators.required, Validators.minLength(5)]],
      pswrepeat: ['', [Validators.required]],
      tipo: ['Donor', Validators.required]
    });
  }

  get formControls() {
    return this.donorForm.controls;
  }

  onSubmit() {
    this.errorMessages = [];
    this.successMessage = '';

    if (this.donorForm.invalid) {
      this.setFormErrors();
      return;
    }

    const donorData = this.donorForm.value;

    if (donorData.psw !== donorData.pswrepeat) {
      this.errorMessages.push('Passwords do not match.');
      return;
    }

    this.donorService.checkEmail(donorData.email).subscribe(response => {
      if (response.exists) {
        this.errorMessages.push('Email already exists.');
      } else {
        this.donorService.createDonor(donorData).subscribe(
          () => {
            this.successMessage = 'Donor created successfully!';
            alert(this.successMessage);  // Display success alert
            this.router.navigate(['/']);
          },
          (error) => {
            this.errorMessages.push(error.message || 'An error occurred');
          }
        );
      }
    }, (error) => {
      this.errorMessages.push(error.message || 'An error occurred');
    });
  }

  private setFormErrors() {
    Object.keys(this.formControls).forEach(key => {
      const controlErrors = this.formControls[key].errors;
      if (controlErrors) {
        for (const errorKey in controlErrors) {
          switch (errorKey) {
            case 'required':
              this.errorMessages.push(`${key} is required.`);
              break;
            case 'minlength':
              this.errorMessages.push(`${key} must be at least ${controlErrors['minlength'].requiredLength} characters long.`);
              break;
            case 'email':
              this.errorMessages.push(`Invalid email format.`);
              break;
            case 'min':
              this.errorMessages.push(`${key} must be at least ${controlErrors['min'].min}.`);
              break;
            default:
              this.errorMessages.push(`${key} has an error: ${errorKey}.`);
              break;
          }
        }
      }
    });
  }
}
