import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FieldMappingPage } from './field-mapping.page';

describe('FieldMappingPage', () => {
  let component: FieldMappingPage;
  let fixture: ComponentFixture<FieldMappingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldMappingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FieldMappingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
