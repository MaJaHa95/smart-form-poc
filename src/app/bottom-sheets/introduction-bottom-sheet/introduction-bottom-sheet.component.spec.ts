import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionBottomSheetComponent } from './introduction-bottom-sheet.component';

describe('IntroductionBottomSheetComponent', () => {
  let component: IntroductionBottomSheetComponent;
  let fixture: ComponentFixture<IntroductionBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroductionBottomSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductionBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
