import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-apmis-pagination',
	templateUrl: './apmis-pagination.component.html',
	styleUrls: [ './apmis-pagination.component.scss' ]
})
export class ApmisPaginationComponent implements OnInit {
	@Input() total = 0;
	@Input() skip = 0;
	@Input() numberOfPages = 0;
	@Input() currentPage = 0;
	@Output() fireCurrentPage: EventEmitter<number> = new EventEmitter<number>();
	defaultPages = [ { id: 0 }, { id: 1 }, { id: 2 } ];
	selectedNumber = 0;
	constructor() {}

	ngOnInit() {}

	moveNext() {
		this.defaultPages.forEach((page) => {
			if (page.id <= this.numberOfPages) {
				page.id = page.id + 1;
			}
		});
		this.selectCurrentPage(this.defaultPages[0].id);
		this.selectedNumber = this.defaultPages[0].id;
	}
	movePrevious() {
		this.defaultPages.forEach((page, i) => {
			let j = 0;
			do {
				page.id = page.id - 1;
				j = j + 1;
			} while (this.defaultPages[i].id - i !== this.defaultPages[i].id && j >= 2);
		});
		this.selectCurrentPage(this.defaultPages[0].id);
		this.selectedNumber = this.defaultPages[0].id;
	}

	selectCurrentPage(page) {
		this.selectedNumber = page;
		this.fireCurrentPage.emit(page);
	}
}
