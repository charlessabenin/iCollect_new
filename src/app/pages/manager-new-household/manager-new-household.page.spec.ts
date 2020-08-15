import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagerNewHouseholdPage } from './manager-new-household.page';

describe('ManagerNewHouseholdPage', () => {
  let component: ManagerNewHouseholdPage;
  let fixture: ComponentFixture<ManagerNewHouseholdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerNewHouseholdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerNewHouseholdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
