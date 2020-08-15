import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StorageMapPage } from './storage-map.page';

describe('StorageMapPage', () => {
  let component: StorageMapPage;
  let fixture: ComponentFixture<StorageMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StorageMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
