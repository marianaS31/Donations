import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonorService } from '../services/donor/donor.service';
import { AdminService } from '../services/admin/admin.service';
import { EntidadeService } from '../services/entidade.service';
import { AuthenticationService } from '../services/authentication.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

interface PointsEvolution {
  date: string;
  points: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  entitie: any;
  donor: { email: string; name: string; points: number } | null = null;
  admin: { email: string; name: string } = { email: '', name: '' };
  role: string | null = null;
  editing: boolean = false;
  nDonations = 0;
  donations: any[] = [];
  searchQuery: string = '';
  filteredDonations: any[] = [];
  pointsEvolution: PointsEvolution[] = [];

  constructor(
    private donorService: DonorService,
    private adminService: AdminService,
    private entidadeService: EntidadeService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getRole().subscribe(
      (data: any) => {
        this.role = data.role;
        console.log('Role:', this.role);
        if (this.role === 'admin') {
          this.loadAdminProfile();
        } else if (this.role === 'donor') {
          this.loadDonorProfile();
        } else if (this.role === 'entitie') {
          this.loadEntitieProfile();
        }
      },
      (error) => {
        console.error('Error fetching role:', error);
      }
    );
  }

  loadDonorProfile(): void {
    this.donorService.getProfile().subscribe(
      (data: any) => {
        console.log('Donor Profile:', data);
        this.donor = data.donor;
        this.getNumberDonations();
        this.getDonations();
        this.getPointsEvolution();
      },
      (error) => {
        console.error('Error fetching donor profile:', error);
      }
    );
  }

  loadAdminProfile(): void {
    this.adminService.getProfile().subscribe(
      (data: any) => {
        console.log('Admin Profile:', data);
        this.admin = data.admin;
      },
      (error) => {
        console.error('Error fetching admin profile:', error);
      }
    );
  }

  loadEntitieProfile(): void {
    this.entidadeService.getProfile().subscribe(
      (data: any) => {
        console.log('entitie Profile:', data);
        this.entitie = data.entitie;
      },
      (error) => {
        console.error('Error fetching entitie profile:', error);
      }
    );
  }

  getNumberDonations(): void {
    this.donorService.donorDonations().subscribe(
      (data: any) => {
        this.nDonations = data.count;
        console.log('Number of Donations:', this.nDonations);
      },
      (error) => {
        console.error('Error fetching number of donations:', error);
      }
    );
  }

  getDonations(): void {
    if (this.donor && this.donor.email) {
      this.donorService.getDonationsByEmail(this.donor.email).subscribe(
        (data: any) => {
          this.donations = data.donations;
          this.filterDonations();
        },
        (error) => {
          console.error('Error fetching donations:', error);
        }
      );
    }
  }

  filterDonations(): void {
    if (!this.searchQuery) {
      this.filteredDonations = [];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredDonations = this.donations.filter(
      (donation) =>
        donation.entity.toLowerCase().includes(query) ||
        donation.type.toLowerCase().includes(query) ||
        donation.date.toLowerCase().includes(query)
    );
  }

  toggleEditing(): void {
    this.editing = !this.editing;
    console.log('Editing state:', this.editing);
  }

  handleProfileUpdated(): void {
    this.editing = false;
    this.loadAdminProfile();
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  getPointsEvolution(): void {
    this.donorService.getPointsEvolution().subscribe(
      (data: any) => {
        if (data && Array.isArray(data.pointsEvolution)) {
          const sortedPointsEvolution = data.pointsEvolution.sort(
            (a: PointsEvolution, b: PointsEvolution) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          // Calculate cumulative points
          let cumulativePoints = 0;
          this.pointsEvolution = sortedPointsEvolution.map(
            (point: PointsEvolution) => {
              cumulativePoints += point.points;
              return {
                date: point.date,
                points: cumulativePoints,
              };
            }
          );

          this.renderPointsEvolutionChart();
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      (error) => {
        console.error('Error fetching points evolution:', error);
      }
    );
  }

  renderPointsEvolutionChart(): void {
    const ctx = (
      document.getElementById('pointsEvolutionChart') as HTMLCanvasElement
    ).getContext('2d');
    if (ctx && Array.isArray(this.pointsEvolution)) {
      const firstDate = this.pointsEvolution[0]?.date;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.pointsEvolution.map((point) => point.date),
          datasets: [
            {
              label: 'Evolução de Pontos',
              data: this.pointsEvolution.map((point) => point.points),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              min: firstDate,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error('pointsEvolution is not an array:', this.pointsEvolution);
    }
  }
}
