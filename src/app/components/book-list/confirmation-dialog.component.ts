import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.component.html',
  })
  export class ConfirmationDialog {
    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>) {}
  }