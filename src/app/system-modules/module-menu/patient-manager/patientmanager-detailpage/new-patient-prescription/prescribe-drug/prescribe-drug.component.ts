import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-prescribe-drug',
	templateUrl: './prescribe-drug.component.html',
	styleUrls: [ './prescribe-drug.component.scss' ]
})
export class PrescribeDrugComponent implements OnInit {
	drugSearch = false;
	constructor() {}
	ngOnInit() {}

	onFocus(focus) {
		if (focus === 'in') {
			this.drugSearch = true;
		} else {
			// setTimeout(() => {
			//   this.drugSearch = false;
			// }, 500);
		}
	}
	close_search(event) {
		this.drugSearch = false;
		console.log(event);
	}
}
