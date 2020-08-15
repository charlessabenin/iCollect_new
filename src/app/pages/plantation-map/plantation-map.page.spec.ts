import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlantationMapPage } from './plantation-map.page';

describe('PlantationMapPage', () => {
  let component: PlantationMapPage;
  let fixture: ComponentFixture<PlantationMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantationMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantationMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
