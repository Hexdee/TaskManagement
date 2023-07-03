import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Task } from '../task.model';



@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];//{ id: "id1", title: "Title 0", description: "Description 1", status: "inProgress" }, { id: "id2", title: "Title 1", description: "Description 1", status: "inProgress" }, { id: "id3", title: "Title 2", description: "Description 1", status: "inProgress" },
  // { id: "id4", title: "Title 5", description: "Description 1", status: "done" }, { id: "id5", title: "Title 4", description: "Description 1", status: "done" }, { id: "id6", title: "Title 3", description: "Description 1", status: "done" }];
  private tasksSubject: BehaviorSubject<Task[]>;

  constructor() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
    this.tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getTasks() {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string, description: string) {
    const task: Task = {
      id: this.tasks.length,
      title,
      description,
      status: "new"
    }
    this.tasks.push(task);
    this.tasksSubject.next(this.tasks);
    this.saveTasks();
  }

  updateTask(task: Task) {
    console.log(task);
    this.tasks[task.id] = task;
    this.tasksSubject.next(this.tasks);
    this.saveTasks();
  }
}


