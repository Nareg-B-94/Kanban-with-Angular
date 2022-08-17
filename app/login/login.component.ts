import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { GlobalArrayService } from '../global-array.service';
import { Observable } from 'rxjs';
import { Task } from 'src/models/task.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  task$: Observable<any>;

  task = new Task();

  constructor(
    public router: Router,
    public firestore: Firestore,
    public globalArray: GlobalArrayService
  ) {}

  ngOnInit(): void {}
  id: any;
  async goToBoard() {
    const coll = collection(this.firestore, 'tasks');
    // this.task$ = collectionData(coll);
    //addDoc creates the collection + id that is empty whereas setDoc creates an id with a value...
    const docRef = await addDoc(coll, {
      todo: [],
      inProgress: [],
      testing: [],
      done: [],
      backlogArray: [],
    });
    this.id = docRef.id;
    this.router.navigateByUrl('/board/' + docRef.id);
  }

  goToHome() {
    this.router.navigateByUrl('' + this.id);
  }

  goToBacklog() {
    this.router.navigateByUrl('backlog/:id' + this.id);
  }
  goToAddTask() {
    this.router.navigateByUrl('add-task/:id' + this.id);
  }
}
