import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPlantationPage } from './edit-plantation.page';

describe('EditPlantationPage', () => {
  let component: EditPlantationPage;
  let fixture: ComponentFixture<EditPlantationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlantationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPlantationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
