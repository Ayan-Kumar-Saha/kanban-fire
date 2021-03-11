import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../task/interface/task';
import { TaskDialogData } from './interface/task-dialog-data';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {

  private _backupTask: Partial<Task> = { ...this.data.task };

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.data.task.title = this._backupTask.title;
    this.data.task.description = this._backupTask.description;
    this.dialogRef.close(this.data);
  }

}
