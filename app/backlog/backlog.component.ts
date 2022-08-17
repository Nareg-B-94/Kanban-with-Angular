import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { GlobalArrayService } from '../global-array.service';
import { Task } from 'src/models/task.class';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
})
export class BacklogComponent implements OnInit {
  dataSource = this.globalArray.backlogArray;

  currentId: any;
  task = new Task();
  constructor(
    public router: Router,
    public globalArray: GlobalArrayService,
    private route: ActivatedRoute,
    public firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentId = params['id'];
      this.getDoc();
    });
  }

  async getDoc() {
    const docRef = doc(this.firestore, 'tasks', this.currentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.globalArray.backlogArray = docSnap.data()['backlogArray'];
      console.log(this.globalArray);
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }

  goToBoard() {
    this.router.navigateByUrl('board/' + this.currentId);
  }
  goToAddTask() {
    this.router.navigateByUrl('add-task/' + this.currentId);
  }
}
