import { Component, OnInit } from '@angular/core';
import { DonationService } from '../services/donation.service';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css'],
})
export class DonationListComponent implements OnInit {
  donations: any[] = [];
  filteredDonations: any[] = [];
  searchTerm: string = '';
  error: string = '';
  states: string[] = [
    'Entregue diretamente',
    'Recebido',
    'Extraviado',
    'Analise',
    'Em deslocação',
    'Ponto de Recolha',
  ];

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.donationService.getDonations().subscribe(
      (data: any) => {
        this.donations = data.donations;
        this.filteredDonations = this.donations;
      },
      (error: any) => {
        this.error = 'Error fetching donations.';
      }
    );
  }

  filterDonations(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredDonations = this.donations.filter((donation) => {
      const dateStr = this.formatDate(donation._id).toLowerCase();
      return (
        donation.donorEmail.toLowerCase().includes(searchTermLower) ||
        donation.entityName.toLowerCase().includes(searchTermLower) ||
        dateStr.includes(searchTermLower)
      );
    });
  }

  updateState(
    entityName: string,
    donationIndex: number,
    newState: string
  ): void {
    this.donationService
      .updateDonationState(entityName, donationIndex, newState)
      .subscribe(
        () => {
          console.log('Donation state updated successfully.');
        },
        (error: any) => {
          console.error('Error updating donation state:', error);
        }
      );
  }

  deleteDonation(donationId: string): void {
    this.donationService.deleteDonation(donationId).subscribe(
      () => {
        this.donations = this.donations.filter(
          (donation) => donation._id !== donationId
        );
        this.filterDonations(); // Update filtered list after deletion
        console.log('Donation deleted successfully.');
      },
      (error: any) => {
        console.error('Error deleting donation:', error);
      }
    );
  }

  formatDate(id: string): string {
    if (!id) {
      return 'Invalid Date';
    }
    const date = new Date(parseInt(id.substring(0, 8), 16) * 1000);
    return date.toLocaleDateString();
  }

  getStates(currentState: string): string[] {
    return [
      currentState,
      ...this.states.filter((state) => state !== currentState),
    ];
  }
}
