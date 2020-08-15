import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagerHouseholdListPage } from './manager-household-list.page';

describe('ManagerHouseholdListPage', () => {
  let component: ManagerHouseholdListPage;
  let fixture: ComponentFixture<ManagerHouseholdListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerHouseholdListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerHouseholdListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
