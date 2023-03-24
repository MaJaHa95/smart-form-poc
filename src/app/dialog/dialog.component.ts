import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  template: `
  <div mat-dialog-content>
  {{ data.message }}
</div>
  <div mat-dialog-actions style="margin: auto;">
    <button mat-button style="margin: auto;" (click)="onClose()">Ok</button>
  </div>
  `,
})
export class DialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}





