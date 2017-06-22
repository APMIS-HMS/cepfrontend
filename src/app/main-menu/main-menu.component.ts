import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html'
})
export class MainMenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
}
