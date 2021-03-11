import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from './interface/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Task;
  @Output() edit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
