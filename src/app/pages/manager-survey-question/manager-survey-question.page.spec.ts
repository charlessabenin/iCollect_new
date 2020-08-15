import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagerSurveyQuestionPage } from './manager-survey-question.page';

describe('ManagerSurveyQuestionPage', () => {
  let component: ManagerSurveyQuestionPage;
  let fixture: ComponentFixture<ManagerSurveyQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSurveyQuestionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerSurveyQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
