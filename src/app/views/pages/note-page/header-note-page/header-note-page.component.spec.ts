import { ComponentFixture, TestBed } from '@angular/core/testing';

import HeaderNotePageComponent from './header-note-page.component';

describe('HeaderNotePageComponent', () => {
  let component: HeaderNotePageComponent;
  let fixture: ComponentFixture<HeaderNotePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNotePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNotePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
