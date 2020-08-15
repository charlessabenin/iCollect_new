import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditHouseholdPage } from './edit-household.page';

describe('EditHouseholdPage', () => {
  let component: EditHouseholdPage;
  let fixture: ComponentFixture<EditHouseholdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHouseholdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditHouseholdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
