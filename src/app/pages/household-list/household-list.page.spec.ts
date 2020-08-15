import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HouseholdListPage } from './household-list.page';

describe('HouseholdListPage', () => {
  let component: HouseholdListPage;
  let fixture: ComponentFixture<HouseholdListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseholdListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
