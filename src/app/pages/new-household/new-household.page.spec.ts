import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewHouseholdPage } from './new-household.page';

describe('NewHouseholdPage', () => {
  let component: NewHouseholdPage;
  let fixture: ComponentFixture<NewHouseholdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHouseholdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewHouseholdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
