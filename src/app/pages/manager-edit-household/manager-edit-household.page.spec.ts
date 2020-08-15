import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagerEditHouseholdPage } from './manager-edit-household.page';

describe('ManagerEditHouseholdPage', () => {
  let component: ManagerEditHouseholdPage;
  let fixture: ComponentFixture<ManagerEditHouseholdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerEditHouseholdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerEditHouseholdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
