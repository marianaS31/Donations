import { Component } from '@angular/core';
import { DonorService } from '../services/donor/donor.service';

@Component({
  selector: 'app-coupon-redemption',
  templateUrl: './coupon-redemption.component.html',
  styleUrls: ['./coupon-redemption.component.css'],
})
export class CouponRedemptionComponent {
  couponValue = 0;
  message = '';

  constructor(private donorService: DonorService) {}

  redeemCoupon() {
    this.donorService.redeemCoupon(this.couponValue).subscribe(
      (response) => {
        this.message = `Coupon redeemed successfully! Your new points balance is ${response.points}.`;
      },
      (error) => {
        if (error.error && error.error.error === 'Insufficient points') {
          this.message = 'Error: Insufficient points to redeem this coupon.';
        } else {
          this.message = 'Error redeeming coupon. Please try again.';
        }
      }
    );
  }
}
