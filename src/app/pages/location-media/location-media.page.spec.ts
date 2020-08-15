import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationMediaPage } from './location-media.page';

describe('LocationMediaPage', () => {
  let component: LocationMediaPage;
  let fixture: ComponentFixture<LocationMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationMediaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
