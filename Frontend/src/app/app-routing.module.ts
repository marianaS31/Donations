import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { EntidadeListComponent } from './components/entidade-list/entidade-list.component';
import { AuthGuardService } from './services/auth-guard.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PerfilEntidadeComponent } from './perfil-entidade/perfil-entidade.component';
import { DonorRegisterComponent } from './donor-register/donor-register.component';
import { CouponRedemptionComponent } from './coupon-redemption/coupon-redemption.component';
import { DonationComponent } from './donation/donation.component';
import { CriarEntidadeComponent } from './criar-entidade/criar-entidade.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DonationListComponent } from './donation-list/donation-list.component'; // Import the DonationListComponent
import { EntityDonationsComponent } from './entity-donations/entity-donations.component';

const routes: Routes = [
  { path: '', component: IndexComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile/edit',
    component: EditProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'entidades/:id',
    component: PerfilEntidadeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'entidades',
    component: EntidadeListComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile/register',
    component: DonorRegisterComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'coupon-redemption',
    component: CouponRedemptionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'create-donation',
    component: DonationComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'entidade/register',
    component: CriarEntidadeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'donation-list',
    component: DonationListComponent,
    canActivate: [AuthGuardService],
  }, // Add the route for the DonationListComponent
  {
    path: 'entity-donations',
    component: EntityDonationsComponent,
    canActivate: [AuthGuardService],
  },

  { path: '**', redirectTo: '' }, // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
