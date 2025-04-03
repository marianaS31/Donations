import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDonationsComponent } from './entity-donations.component';

describe('EntityDonationsComponent', () => {
  let component: EntityDonationsComponent;
  let fixture: ComponentFixture<EntityDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityDonationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntityDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
