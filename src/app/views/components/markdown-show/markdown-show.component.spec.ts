import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownShowComponent } from './markdown-show.component';

describe('MarkdownShowComponent', () => {
  let component: MarkdownShowComponent;
  let fixture: ComponentFixture<MarkdownShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownShowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
