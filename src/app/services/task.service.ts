import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Task } from '../task';


interface IAllTasks {
  new: Task[];
  inProgress: Task[];
  done: Task[];
}

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private tasks: IAllTasks;
  private tasksSubject: BehaviorSubject<IAllTasks>;

  constructor() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      console.log("tasks", this.tasks);
    } else {
      this.tasks = { new: [], inProgress: [], done: [] };
    }
    this.tasksSubject = new BehaviorSubject<IAllTasks>(this.tasks);
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getTasks() {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string, description: string) {
    const task = new Task(this.tasks.new.length, title, description);
    this.tasks.new.push(task);
    this.tasksSubject.next(this.tasks);
    this.saveTasks();
  }

  editTask(task: Task, status: "new" | "inProgress" | "done") {
    const index = this.tasks[status].findIndex((t) => t.id == task.id);
    this.tasks[status][index].title = task.title;
    this.tasks[status][index].description = task.description;
    this.saveTasks();
  }

  deleteTask(task: Task, status: "new" | "inProgress" | "done") {
    const index = this.tasks[status].findIndex((t) => t.id == task.id);
    this.tasks[status].splice(index, 1);
    this.saveTasks();
  }
}