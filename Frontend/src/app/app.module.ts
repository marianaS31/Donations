import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list'; // Importando o módulo do Angular Material

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { EntidadeService } from './services/entidade.service';
import { EntidadeListComponent } from './components/entidade-list/entidade-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PerfilEntidadeComponent } from './perfil-entidade/perfil-entidade.component';
import { DonorRegisterComponent } from './donor-register/donor-register.component';
import { CouponRedemptionComponent } from './coupon-redemption/coupon-redemption.component';
import { DonationComponent } from './donation/donation.component';
import { PaypalService } from './services/paypal.service';
import { CriarEntidadeComponent } from './criar-entidade/criar-entidade.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DonationListComponent } from './donation-list/donation-list.component';
import { EntityDonationsComponent } from './entity-donations/entity-donations.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    ProfileComponent,
    EntidadeListComponent,
    NavbarComponent,
    EditProfileComponent,
    PerfilEntidadeComponent,
    DonorRegisterComponent,
    CouponRedemptionComponent,
    DonationComponent,
    CriarEntidadeComponent,
    AdminDashboardComponent,
    DonationListComponent,
    EntityDonationsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatGridListModule,
  ], // Adicionando MatGridListModule aos imports
  providers: [
    AuthenticationService,
    AuthGuardService,
    EntidadeService,
    PaypalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
