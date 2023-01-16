import { Component } from '@angular/core';
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-lot-number-help-bottom-sheet',
  templateUrl: './lot-number-help-bottom-sheet.component.html',
  styleUrls: ['./lot-number-help-bottom-sheet.component.scss']
})
export class LotNumberHelpBottomSheetComponent {
  constructor(private readonly bottomSheetRef: MatBottomSheetRef<LotNumberHelpBottomSheetComponent>) { }

  ok(): void {
    this.bottomSheetRef.dismiss();
  }

}
