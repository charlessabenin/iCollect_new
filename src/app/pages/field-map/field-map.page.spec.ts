import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FieldMapPage } from './field-map.page';

describe('FieldMapPage', () => {
  let component: FieldMapPage;
  let fixture: ComponentFixture<FieldMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FieldMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
