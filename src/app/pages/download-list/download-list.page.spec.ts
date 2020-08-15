import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadListPage } from './download-list.page';

describe('DownloadListPage', () => {
  let component: DownloadListPage;
  let fixture: ComponentFixture<DownloadListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
