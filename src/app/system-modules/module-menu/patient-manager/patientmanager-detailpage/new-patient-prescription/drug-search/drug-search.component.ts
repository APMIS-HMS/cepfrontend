import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-drug-search',
	templateUrl: './drug-search.component.html',
	styleUrls: [ './drug-search.component.scss' ]
})
export class DrugSearchComponent implements OnInit {
	@Input()
	products: any = [
		{ name: 'Rimoxallin 400 MG Oral Capsule', marked: false },
		{ name: 'Trimox 50 MG/ML Oral Suspension', marked: false },
		{ name: 'Noltam 20 MG Oral Tablet', marked: false },
		{ name: 'Trimox 250 MG Oral Capsule [Trimox]', marked: false }
	];
	@Input()
	commonProducts: any = [
		{ name: 'Amoxicillin 500 MG Oral Capsule [Rimoxallin]' },
		{ name: 'Amoxicillin 50 MG/ML Oral Suspension [Trimox]' },
		{ name: 'Tamoxifen 10 MG Oral Tablet [Noltam]' },
		{ name: 'Amoxicillin 250 MG Oral Capsule [Trimox]' }
	];
	@Output() closeSearch: EventEmitter<any> = new EventEmitter<any>();
	constructor() {}

	ngOnInit() {}

	setMarked(event, product) {
		// console.log(product);
		// console.log(event.target.checked);
	}

	selectProduct(event, product) {
		// console.log(product);
		this.closeSearch.emit(product);
	}
}
