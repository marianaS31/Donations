import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin/admin.service';
import { EntidadeService } from '../services/entidade.service';
import { ActivatedRoute } from '@angular/router';

import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  pendingEntities: any[] = [];
  loading = true;
  avgKgPerDonation: number = 0; // Initialized with default value
  donationsPerDistrict: any[] = []; // Initialized with empty array
  clothingTypesPie: any[] = []; // Initialized with empty array

  constructor(
    private adminService: AdminService,
    private entidadeService: EntidadeService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
  
    this.loadPendingEntities();
    this.loadAverageKgPerDonation();
    this.loadDonationsPerDistrict();
    this.loadClothingTypesPie();
  }

  loadPendingEntities() {
    this.entidadeService.getPendingEntities().subscribe(
      (data) => {
        this.pendingEntities = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching pending entities:', error);
        this.loading = false;
      }
    );
  }

  acceptEntity(entity: any) {
    this.entidadeService.acceptPendingEntity(entity._id).subscribe(
      (response) => {
        console.log('Entity accepted:', entity);
        this.loadPendingEntities(); // Atualizar a lista após aceitar
      },
      (error) => {
        console.error('Error accepting entity:', error);
      }
    );
  }

  rejectEntity(entity: any) {
    this.entidadeService.rejectPendingEntity(entity._id).subscribe(
      (response) => {
        console.log('Entity rejected:', entity);
        this.loadPendingEntities(); // Atualizar a lista após rejeitar
      },
      (error) => {
        console.error('Error rejecting entity:', error);
      }
    );
  }

  loadAverageKgPerDonation() {
    this.adminService.getAverageKgPerDonation().subscribe(
      (data) => {
        this.avgKgPerDonation = data.avgKg;
        this.renderAvgKgPerDonationChart();
      },
      (error) => {
        console.error('Error fetching average kg per donation:', error);
      }
    );
  }

  loadDonationsPerDistrict() {
    this.adminService.getDonationsPerDistrict().subscribe(
      (data) => {
        this.donationsPerDistrict = data;
        this.renderDonationsPerDistrictChart();
      },
      (error) => {
        console.error('Error fetching donations per district:', error);
      }
    );
  }

  loadClothingTypesPie() {
    this.adminService.getClothingTypesPie().subscribe(
      (data) => {
        this.clothingTypesPie = data;
        this.renderClothingTypesPieChart();
      },
      (error) => {
        console.error('Error fetching clothing types pie data:', error);
      }
    );
  }

  renderAvgKgPerDonationChart() {
    const ctx = document.getElementById(
      'avgKgPerDonationChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Average kg per donation'],
        datasets: [
          {
            label: 'kg',
            data: [this.avgKgPerDonation],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

  renderDonationsPerDistrictChart() {
    const labels = this.donationsPerDistrict.map((d) => d._id);
    const data = this.donationsPerDistrict.map((d) => d.totalDonations);
    const ctx = document.getElementById(
      'donationsPerDistrictChart'
    ) as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Donations',
            data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

  renderClothingTypesPieChart() {
    const labels = this.clothingTypesPie.map((d) => d._id);
    const data = this.clothingTypesPie.map((d) => d.count);
    const ctx = document.getElementById(
      'clothingTypesPieChart'
    ) as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }
}
