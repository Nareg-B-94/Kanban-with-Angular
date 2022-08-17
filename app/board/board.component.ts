import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Task } from 'src/models/task.class';
import { GlobalArrayService } from '../global-array.service';



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  panelOpenState = false;
  currentId: any;
  task = new Task();

  constructor(
    public globalArray: GlobalArrayService,
    private route: ActivatedRoute,
    public firestore: Firestore,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentId = params['id'];
    });
    console.log(this.route);

    this.getDoc();
  }

  async getDoc() {
    const docRef = doc(this.firestore, 'tasks', this.currentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.globalArray.todo = docSnap.data()['todo'];
      this.globalArray.inProgress = docSnap.data()['inProgress'];
      this.globalArray.testing = docSnap.data()['testing'];
      this.globalArray.done = docSnap.data()['done'];
      console.log(this.globalArray);
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateArrays();
    }
  }

  async updateArrays() {
    const coll = collection(this.firestore, 'tasks');
    const userRef = doc(coll, this.currentId);
    const docRef = await setDoc(userRef, {
      todo: this.globalArray.todo,
      inProgress: this.globalArray.inProgress,
      testing: this.globalArray.testing,
      done: this.globalArray.done,
      backlogArray: this.globalArray.backlogArray,
    });
    console.log(this.globalArray.todo);
  }

  goToBacklog() {
    this.router.navigateByUrl('backlog/' + this.currentId);
  }
  goToAddTask() {
    this.router.navigateByUrl('add-task/' + this.currentId);
  }

  deleteToDo(i: any) {
    console.log('deleted!');
   await this.globalArray.todo.FieldValue.delete(i);
    this.updateArrays;
  }

  deleteInProgress(i: any) {}
  deleteTesting(i: any) {}
  deleteDone(i: any) {}
}
