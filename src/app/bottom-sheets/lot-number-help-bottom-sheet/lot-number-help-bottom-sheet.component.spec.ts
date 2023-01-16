import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotNumberHelpBottomSheetComponent } from './lot-number-help-bottom-sheet.component';

describe('LotNumberHelpBottomSheetComponent', () => {
  let component: LotNumberHelpBottomSheetComponent;
  let fixture: ComponentFixture<LotNumberHelpBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotNumberHelpBottomSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotNumberHelpBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
