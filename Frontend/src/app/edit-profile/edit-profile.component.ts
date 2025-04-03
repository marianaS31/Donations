import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DonorService } from '../services/donor/donor.service';
import { Donor } from '../services/donor/donor';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent {
  @Input() donor: Donor = {
    email: '',
    name: '',
    lname: '',
    psw: '',
    pswrepeat: '',
    tipo: '',
  };
  successMessage = '';


  @Output() profileUpdated = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();

  errors: string[] = []; // Array to store error messages

  constructor(private donorService: DonorService, private router: Router) {}

  saveDonorProfile(form: NgForm): void {
    if (form.valid) {
      this.donorService.updateProfile(this.donor).subscribe(
        (response: any) => {
          console.log('Profile updated successfully', response);
          this.errors = []; // Clear errors on success
          this.profileUpdated.emit();
          this.successMessage = 'Donor updated successfully!';
          alert(this.successMessage);  // Display success alert
          this.router.navigate(['/']); // Navigate to index on success
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.errors = error.error.errors || ['An unknown error occurred.']; // Capture errors
        }
      );
    }
  }

  cancel(): void {
    this.cancelEdit.emit();
    this.router.navigate(['/']); // Navigate to index on cancel
  }
}
