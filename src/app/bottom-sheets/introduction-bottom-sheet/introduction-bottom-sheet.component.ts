import { Component } from '@angular/core';
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-introduction-bottom-sheet',
  templateUrl: './introduction-bottom-sheet.component.html',
  styleUrls: ['./introduction-bottom-sheet.component.scss']
})
export class IntroductionBottomSheetComponent {
  constructor(private readonly bottomSheetRef: MatBottomSheetRef<IntroductionBottomSheetComponent>) { }

  ok(): void {
    this.bottomSheetRef.dismiss();
  }
}
