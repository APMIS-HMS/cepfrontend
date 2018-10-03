import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-bcr-assessment',
	templateUrl: './bcr-assessment.component.html',
	styleUrls: [
		'./bcr-assessment.component.scss',
		'../../../payment/bill-lookup/bill-lookup.component.scss',
	],
})
export class BcrAssessmentComponent implements OnInit {
	patient: any;
	selectedDocument: any;
	docDetail_view = false;
	addProblem_view = false;
	addAllergy_view = false;
	addHistory_view = false;
	addVitals_view = false;
	constructor() {}

	ngOnInit() {}

	addProblem_show(event) {}

	addHistory_show(event) {}

	addVitals_show(event) {}

	addAllergy_show(event) {}
	close_onClick(event){}
}
