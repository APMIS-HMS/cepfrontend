import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-all-products',
	templateUrl: './all-products.component.html',
	styleUrls: [ './all-products.component.scss' ]
})
export class AllProductsComponent implements OnInit {
	clickItemIndex: number;
	expand_row = false;
	total = 0;
	skip = 0;
	numberOfPages = 0;
	currentPage = 0;
	limit = 4;
	packTypes = [ { id: 1, name: 'Sachet' }, { id: 2, name: 'Cartoon' } ];
	products: any[] = [
		{
			productName: 'Medroxyprogesterone acetate 10 MG Oral Tablet [Curretab]',
			quantity: '100',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Tetracycline 0.01 MG/MG Ophthalmic Ointment [Achromycin]',
			quantity: '1005',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Nifedipine 10 MG Oral Capsule [Adalat]',
			quantity: '3500',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		},
		{
			productName: 'Oxymetholone 50 MG Oral Tablet [Anadrol-50]',
			quantity: '900',
			pack: 'Sachet',
			costPrice: 500,
			reOrderLevel: 20,
			totalCostPrice: 3000,
			unitSellingPrice: 700
		}
	];

	constructor() {}

	ngOnInit() {
		this.numberOfPages = this.products.length / this.limit;
		this.total = this.products.length;
	}

	item_to_show(i) {
		if (this.expand_row) {
			return this.clickItemIndex === i;
		}
	}
	toggle_tr(itemIndex) {
		this.clickItemIndex = itemIndex;
		this.expand_row = !this.expand_row;
	}

	loadCurrentPage(event) {
		this.skip = event;
	}

	getProductSlice(products) {
		const first = this.skip * this.limit;
		const second = this.limit + this.skip * this.limit;
		const slicedProducts = products.slice(first, second);
		return slicedProducts;
	}
}
