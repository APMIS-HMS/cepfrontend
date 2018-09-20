import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-configured-products',
  templateUrl: './configured-products.component.html',
  styleUrls: ['./configured-products.component.scss']
})
export class ConfiguredProductsComponent implements OnInit {

  searchControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
