import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

  docDetail_view = false;

  constructor() { }

  ngOnInit() {
  }

  docDetail_show(){
    this.docDetail_view = true;
  }

  close_onClick(message: boolean): void {
    this.docDetail_view = false;
  }

}
