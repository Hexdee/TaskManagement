import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  taskForm!: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private notificataionService: NotificationService
  ) { }

  maxWordsValidator(maxWords: number) {
    return (control: AbstractControl) => {
      return new Promise((resolve) => {
        const value = control.value;
        const words = value ? value.trim().split(/\s+/) : [];
        if (words.length > maxWords) {
          resolve({
            maxWords: {
              actualWords: words.length,
              maxAllowed: maxWords
            }
          });
        } else {
          resolve(null);
        }
      })
    };
  }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required, this.maxWordsValidator(15)]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.taskForm.invalid) {
      this.notificataionService.showError("Please provide a valid Title and Description!");
      this.loading = false;
      return;
    }

    const title = this.taskForm.value.title;
    const description = this.taskForm.value.description;

    this.taskService.addTask(title, description);
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
      this.notificataionService.showSuccess("New Task successfully created!");
    }, 500);
  }
}