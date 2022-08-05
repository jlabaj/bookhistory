import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'confirmation-dialog',
    styleUrls: ['confirmation-dialog.component.scss'],
    templateUrl: 'confirmation-dialog.component.html',
  })
  export class ConfirmationDialog {
    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    public clickNo() {
      this.dialogRef.close('no');
    }
  
    public clickYes() {
        this.dialogRef.close('yes');
    }
  }

  