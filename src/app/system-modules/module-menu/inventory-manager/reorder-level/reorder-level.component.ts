import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-reorder-level',
  templateUrl: './reorder-level.component.html',
  styleUrls: ['./reorder-level.component.scss']
})
export class ReorderLevelComponent implements OnInit {

  reorderLevel = new FormControl();
  packType = new FormControl();
  product = new FormControl();
  setLevel = false;

  constructor() { }

  ngOnInit() {
  }

  setLevel_click(){
    this.setLevel = !this.setLevel;
  }

}
