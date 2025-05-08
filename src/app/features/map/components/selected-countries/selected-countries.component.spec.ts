import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCountriesComponent } from './selected-countries.component';

describe('SelectedCountriesComponent', () => {
  let component: SelectedCountriesComponent;
  let fixture: ComponentFixture<SelectedCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedCountriesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
