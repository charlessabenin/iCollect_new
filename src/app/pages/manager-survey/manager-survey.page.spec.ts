import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagerSurveyPage } from './manager-survey.page';

describe('ManagerSurveyPage', () => {
  let component: ManagerSurveyPage;
  let fixture: ComponentFixture<ManagerSurveyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSurveyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
