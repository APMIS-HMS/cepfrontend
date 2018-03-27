import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {

  searchProduct = new FormControl();
  suggest = false;

  constructor() { }

  ngOnInit() {
  }

  onKeydown(){
    this.suggest = true;
  }
  suggestion_click(){
    this.suggest = false;
  }

}
