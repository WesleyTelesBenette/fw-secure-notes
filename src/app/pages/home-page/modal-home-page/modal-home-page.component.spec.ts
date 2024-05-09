import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHomePageComponent } from './modal-home-page.component';

describe('ModalHomePageComponent', () => {
  let component: ModalHomePageComponent;
  let fixture: ComponentFixture<ModalHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
