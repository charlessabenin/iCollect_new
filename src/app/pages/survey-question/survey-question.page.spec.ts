import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveyQuestionPage } from './survey-question.page';

describe('SurveyQuestionPage', () => {
  let component: SurveyQuestionPage;
  let fixture: ComponentFixture<SurveyQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyQuestionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
