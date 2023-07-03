import { Component } from '@angular/core';
import { Task } from '../task';
import { TaskService } from '../services/task.service';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  newTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];


  constructor(private taskService: TaskService) {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.newTasks = tasks.new;
      this.inProgressTasks = tasks.inProgress;
      this.doneTasks = tasks.done;
    });
  }

  deleteTask(task: Task, status: "new" | "inProgress" | "done") {
    this.taskService.deleteTask(task, status);
  }

  onTaskDropped(event: CdkDragDrop<Task[]>) {
    console.log({ event });
    if (event.previousContainer === event.container) {
      console.log(event);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.taskService.saveTasks();
  }
}
