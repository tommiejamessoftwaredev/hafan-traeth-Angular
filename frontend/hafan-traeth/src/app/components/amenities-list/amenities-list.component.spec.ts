import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AmenitiesListComponent } from './amenities-list.component';

describe('AmenitiesListComponent', () => {
  let component: AmenitiesListComponent;
  let fixture: ComponentFixture<AmenitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenitiesListComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});