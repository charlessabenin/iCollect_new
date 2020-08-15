import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlantationListPage } from './plantation-list.page';

describe('PlantationListPage', () => {
  let component: PlantationListPage;
  let fixture: ComponentFixture<PlantationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
