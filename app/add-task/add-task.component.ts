import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Task } from 'src/models/task.class';
import { GlobalArrayService } from '../global-array.service';
import { Firestore,  collection } from '@angular/fire/firestore';
import {  doc, getDoc, updateDoc } from "firebase/firestore";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {



  coll: any;
  docRef: any;
  docSnap: any;
  currentId: any;

  public add_task: FormGroup;
  task = new Task();

  task$: Observable<any>;

  constructor(
    public router: Router,
    public globalArray: GlobalArrayService,
    public firestore: Firestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentId = params['id'];
      console.log(this.route);
    });

    console.log(this.currentId);
console.table(this.globalArray); // souvenir von MAIKY :D
    this.getDoc();

    this.add_task = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        // Validators.minLength(2),
        // Validators.maxLength(35),
      ]),
      category: new FormControl('', [Validators.required]),
      urgency: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        // Validators.minLength(5),
        // Validators.maxLength(80),
      ]),
      date: new FormControl('', [Validators.required]),
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.add_task.controls[controlName].hasError(errorName);
  };

  async getDoc() {
    const docRef = doc(this.firestore, 'tasks', this.currentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.globalArray.todo = docSnap.data()['todo'];
      this.globalArray.inProgress = docSnap.data()['inProgress'];
      this.globalArray.testing = docSnap.data()['testing'];
      this.globalArray.done = docSnap.data()['done'];
      this.globalArray.backlogArray = docSnap.data()['backlogArray'];
      console.log(this.globalArray);
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }

  async addTask() {
    this.globalArray.todo.push(this.task.toJSON());
    this.globalArray.backlogArray.push(this.task.toJSON());
    const coll = collection(this.firestore, 'tasks');
    const userRef = doc(coll, this.currentId);
    const docRef = await updateDoc(userRef, {
      todo: this.globalArray.todo,
      backlogArray: this.globalArray.backlogArray,
    });
    this.goToBoard()
    console.log(this.globalArray.todo);
  }

  goToBacklog() {
    this.router.navigateByUrl('backlog/' + this.currentId);
  }
  goToBoard() {
    this.router.navigateByUrl('board/' + this.currentId);
  }
}
