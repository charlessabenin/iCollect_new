import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditMediaPage } from './edit-media.page';

describe('EditMediaPage', () => {
  let component: EditMediaPage;
  let fixture: ComponentFixture<EditMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMediaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
