import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingContentPageComponent } from './loading-content-page.component';

describe('LoadingContentPageComponent', () => {
  let component: LoadingContentPageComponent;
  let fixture: ComponentFixture<LoadingContentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingContentPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingContentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
