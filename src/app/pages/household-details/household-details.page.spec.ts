import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HouseholdDetailsPage } from './household-details.page';

describe('HouseholdDetailsPage', () => {
  let component: HouseholdDetailsPage;
  let fixture: ComponentFixture<HouseholdDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseholdDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
