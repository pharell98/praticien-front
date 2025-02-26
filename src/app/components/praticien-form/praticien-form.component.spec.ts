import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PraticienFormComponent } from './praticien-form.component';

describe('PraticienFormComponent', () => {
  let component: PraticienFormComponent;
  let fixture: ComponentFixture<PraticienFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PraticienFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PraticienFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
