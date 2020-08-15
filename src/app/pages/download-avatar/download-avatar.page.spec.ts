import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadAvatarPage } from './download-avatar.page';

describe('DownloadAvatarPage', () => {
  let component: DownloadAvatarPage;
  let fixture: ComponentFixture<DownloadAvatarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAvatarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadAvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
