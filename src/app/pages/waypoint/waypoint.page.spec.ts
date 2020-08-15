import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaypointPage } from './waypoint.page';

describe('WaypointPage', () => {
  let component: WaypointPage;
  let fixture: ComponentFixture<WaypointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaypointPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaypointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
