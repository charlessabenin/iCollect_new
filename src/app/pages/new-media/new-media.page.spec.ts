import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewMediaPage } from './new-media.page';

describe('NewMediaPage', () => {
  let component: NewMediaPage;
  let fixture: ComponentFixture<NewMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMediaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
