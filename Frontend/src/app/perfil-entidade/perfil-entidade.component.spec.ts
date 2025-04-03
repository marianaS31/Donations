import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEntidadeComponent } from './perfil-entidade.component';

describe('PerfilEntidadeComponent', () => {
  let component: PerfilEntidadeComponent;
  let fixture: ComponentFixture<PerfilEntidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilEntidadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilEntidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
