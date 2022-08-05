import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'new-book-dialog',
    styleUrls: ['new-book-dialog.component.scss'],
    templateUrl: 'new-book-dialog.component.html',
  })
  export class NewBookDialog implements OnInit {
    constructor(public dialogRef: MatDialogRef<NewBookDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit(): void {
    let book = this.data.dataKey.book;
    this.form = this.fb.group({
      'key': [book.key, ''],
      'isbn': [book.isbn, Validators.required],
      'title': [book.title, Validators.required],
      'genre': [book.genre, Validators.required],
      'description': [book.description],
      'publishedDate': [new Date(book.publishedDate), Validators.required],
      'authors': [book.authors, Validators.required],
  });
  }

    public form!: FormGroup;

    public close() {
      this.dialogRef.close();
    }
  
    public save() {
        this.dialogRef.close(this.form.value);
    }
  }

  