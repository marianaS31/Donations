import { Component, OnInit } from '@angular/core';
import { EntidadeService } from '../services/entidade.service';

@Component({
  selector: 'app-entity-donations',
  templateUrl: './entity-donations.component.html',
  styleUrls: ['./entity-donations.component.css'],
})
export class EntityDonationsComponent implements OnInit {
  donations: any[] = [];
  filteredDonations: any[] = [];
  errorMessage: string = '';
  searchCriteria: { donorEmail?: string; type?: string; date?: string } = {};

  constructor(private entidadeService: EntidadeService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.entidadeService.getDonations().subscribe(
      (data) => {
        this.donations = data.donations;
        this.filteredDonations = this.donations;
      },
      (error) => {
        this.errorMessage = `Error fetching donations: ${error}`;
        console.error('Error fetching donations:', error);
      }
    );
  }

  onSearch(): void {
    this.filteredDonations = this.donations.filter((donation) => {
      return (
        (!this.searchCriteria.donorEmail ||
          donation.donorEmail
            .toLowerCase()
            .includes(this.searchCriteria.donorEmail.toLowerCase())) &&
        (!this.searchCriteria.type ||
          donation.type
            .toLowerCase()
            .includes(this.searchCriteria.type.toLowerCase())) &&
        (!this.searchCriteria.date ||
          donation.date.includes(this.searchCriteria.date))
      );
    });
  }
}
