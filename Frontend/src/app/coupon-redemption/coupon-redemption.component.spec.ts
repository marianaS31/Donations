import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponRedemptionComponent } from './coupon-redemption.component';

describe('CouponRedemptionComponent', () => {
  let component: CouponRedemptionComponent;
  let fixture: ComponentFixture<CouponRedemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CouponRedemptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CouponRedemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
