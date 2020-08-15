import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagerHouseholdPage } from './manager-household.page';

describe('ManagerHouseholdPage', () => {
  let component: ManagerHouseholdPage;
  let fixture: ComponentFixture<ManagerHouseholdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerHouseholdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerHouseholdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
