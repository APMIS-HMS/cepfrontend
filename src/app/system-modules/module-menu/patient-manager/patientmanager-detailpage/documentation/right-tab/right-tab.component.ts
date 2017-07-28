import { Component, OnInit, EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'app-right-tab',
  templateUrl: './right-tab.component.html',
  styleUrls: ['./right-tab.component.scss']
})
export class RightTabComponent implements OnInit {

  @Output() addProblem: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addAllergy: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addHistory: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addVitals: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  addProblem_show() {
      this.addProblem.emit(true);
  }
  addAllergy_show() {
      this.addAllergy.emit(true);
  }
  addHistory_show() {
      this.addHistory.emit(true);
  }
  addVitals_show() {
      this.addVitals.emit(true);
  }

}
