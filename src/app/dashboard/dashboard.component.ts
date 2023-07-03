import { Component } from '@angular/core';
import { Task } from '../task.model';
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
      this.newTasks = [];
      this.inProgressTasks = [];
      this.doneTasks = [];
      tasks.map(task => {
        if (task.status == "done") {
          this.doneTasks.push(task);
        } else if (task.status == "inProgress") {
          this.inProgressTasks.push(task);
        } else {
          this.newTasks.push(task);
        }
      })
    });
  }

  onTaskDropped(event: CdkDragDrop<Task[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event)
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = targetStatus;
      this.taskService.updateTask(movedTask);
    }
  }
}
