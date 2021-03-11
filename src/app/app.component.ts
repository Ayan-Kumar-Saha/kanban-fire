import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Task } from './task/interface/task';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskDialogResult } from './task-dialog/interface/task-dialog-result';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public backlog = getObservable(this._firestore.collection('backlog')) ;
  public inProgress = getObservable(this._firestore.collection('inProgress')) ;
  public done = getObservable(this._firestore.collection('done'));

  constructor(
    private _dialog: MatDialog,
    private _firestore: AngularFirestore
  ) { }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) return;

    const item = event.previousContainer.data['_value'][event.previousIndex];

    this._firestore.firestore.runTransaction(() => {
      
      return Promise.all([
        this._firestore.collection(event.previousContainer.id)
          .doc(item.id)
          .delete(),
        this._firestore.collection(event.container.id)
          .add(item)
      ])
    });

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  editTask(list: 'backlog' | 'inProgress' | 'done', task: Task): void {

    const dialogRef = this._dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true
      }
    });

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (result.delete) {
          this._firestore.collection(list).doc(task.id).delete();
        } else {
          this._firestore.collection(list).doc(task.id).update(task);
        }
      })
  }

  newTask() {
    const dialogRef = this._dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {}
      }
    })

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (result.task.title !== undefined && result.task.title !== '')
          this._firestore.collection('backlog').add(result.task);
      }
      );
  }
}
