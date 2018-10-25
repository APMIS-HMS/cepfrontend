import {
	AfterViewInit,
	Component,
	DoCheck,
	EventEmitter,
	Input,
	KeyValueDiffer,
	KeyValueDiffers,
	OnChanges,
	OnInit,
	Output,
	QueryList,
	SimpleChanges,
	ViewChild,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';

export const BUTTON_SIZE_DEFAULT: string = 'default';
export const BUTTON_SIZE_MEDIUM: string = 'medium';
export const BUTTON_SIZE_LARGE: string = 'large';
export const PAGER_HORIZONTAL_ALIGNMENT_CENTER: string = 'center';
export const PAGER_HORIZONTAL_ALIGNMENT_LEFT: string = 'left';
export const PAGER_HORIZONTAL_ALIGNMENT_RIGHT: string = 'right';

export interface IPagerSource {
	totalPages?: number;
	totalRecord?: number;
	pageSize: number; // Total record  per page
	currentPage: number; // current Page Index (Zero base index)
}

@Component({
	selector: 'asom-pager-button',
	template: `
    <p (click)="emitButtonClickEvent($event)" class="button"
       [ngClass]="{'asom-pager-button-disable' : disable, 'asom-pager-button' : !disable}"
       [ngStyle]="{'color' : foreColor,'background-color' : !disable? bgColor : 'white',
           'border-radius':isOval ? '100%':'0px','padding' : padding,'font-size' : fontSize,
           'margin-left':isOval ? '4px':'0px','margin-right':isOval ? '4px':'0px' }">
      <ng-content>

      </ng-content>
    </p>  `,
	styles: [
		`
    p.asom-pager-button:hover, p.asom-pager-button:focus {
      background-color: rgba(213, 255, 236, 0.8) !important;
      color: #3c3c3c !important;
    }

    p.button {
      align-items: center;
      transition: all linear 400ms;
      font-size: 1rem;
      padding: 0px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      width: 40px;
      height: 40px;
      border-radius: 100%;
    }

    p.asom-pager-button-disable {

      border: solid 1px #e7e7e7;
      background-color: #e4e4e4 !important;
      cursor: not-allowed;
      color: #898989;

    }

    p.asom-pager-button {
      box-shadow: 1px 1px 7px rgba(132, 132, 132, 0.68);
      background-color: #ffffff;
      cursor: pointer;

    }
  `
	]
})
export class PagerButtonComponent implements OnChanges {
	@Input() size: string = BUTTON_SIZE_DEFAULT;
	@Input('background-color') bgColor: string = 'white';
	@Input('fore-color') foreColor: string = '#404040';
	@Input('is-oval') isOval: boolean = true;
	@Input('is-disable') disable: boolean = false;

	@Output() onClick: EventEmitter<void> = new EventEmitter<void>();
	fontSize: string;
	padding: string;

	ngOnChanges(changes: SimpleChanges): void {
		// check if the backColor has a different color other than white and change the fore color appropriately

		if (changes['bgColor'] != undefined) {
			if (changes['bgColor'].currentValue === 'white') {
				this.foreColor = '#404040';
			} else {
				this.foreColor = '#ffffff';
			}
		}
		if (changes['size'] != undefined) {
			this.updateButtonSize();
		}
	}

	private updateButtonSize() {
		switch (this.size) {
			case BUTTON_SIZE_DEFAULT:
				this.padding = '0px';
				this.fontSize = '13px';
				break;
			case BUTTON_SIZE_MEDIUM:
				this.padding = '30px';
				this.fontSize = '18px';
				break;
			case BUTTON_SIZE_LARGE:
				this.padding = '45px';
				this.fontSize = '24px';
				break;
			default:
				this.padding = '0px';
				this.fontSize = '13px';
				break;
		}
	}

	removeBgColor() {
		this.bgColor = 'white';
	}

	disableButton() {
		this.disable = true;
	}

	enableButton() {
		this.disable = false;
	}

	emitButtonClickEvent($event) {
		// Just raise the event
		if (!this.disable) {
			this.onClick.emit();
		}
	}
}

@Component({
	selector: 'asom-data-pager',
	template: `
    <div class="asom-pager-button-container" *ngIf="pagerSource" [ngStyle]="{'justify-content' : flexJustify }">
      <asom-pager-button [size]="buttonSize" [is-disable]="true" *ngIf="showProgress" [is-oval]="useOvalButton">
               <span class="fa fa-refresh fa-spin" *ngIf="inProgress">
                   
               </span>
        <span class="fa fa-anchor" *ngIf="!inProgress">
                   
               </span>
      </asom-pager-button>
      <asom-pager-button [size]="buttonSize" [is-disable]="pageIndex <= 0 || inProgress" (onClick)="gotoPrevPage()"
                         *ngIf="showNextPrev" #prev
                         [is-oval]="useOvalButton" [background-color]="nextPrevColor">
        &lt;
      </asom-pager-button>
      <asom-pager-button [size]="buttonSize" #pg [is-oval]="useOvalButton"
                         [background-color]="pageIndex === index ? color:'white'"
                         (onClick)="pagerButtonClick(index)" [is-disable]="inProgress"
                         *ngFor="let p of totalPages; let index = index">{{index + 1}}
      </asom-pager-button>
      <asom-pager-button [size]="buttonSize" [is-disable]="pageIndex >= totalPages.length-1 || inProgress"
                         (onClick)="gotoNextPage()"
                         *ngIf="showNextPrev" #next [background-color]="nextPrevColor"
                         [is-oval]="useOvalButton">&gt;
      </asom-pager-button>
      <p *ngIf="showTotalRecord" style="font-weight : bold;height: 42px;display: flex;
            flex-direction: column;justify-content: center; 
            align-items: center;min-width: 42px;" [ngStyle]="{'font-size':(buttonSize ==='large' ? '18px' : '14px')}">
        {{pagerSource.totalRecord}}
      </p>
    </div>
    <div class="asom-pager-button-container" *ngIf="!pagerSource" #pagerSourceNotSet>
      <p class="text-danger" style="background-color: #ffd6da; padding: 10px; color:#ca0100;">Pager Source not Set</p>
    </div>

  `,
	styles: [
		`
    div.asom-pager-button-container {
      display: flex;
      justify-content: center;
      flex-direction: row;
      align-content: center;
    }

  `
	]
})
export class AsomDataPagerComponent implements OnInit, AfterViewInit, OnChanges, DoCheck {
	@Output() onPageClick: EventEmitter<number> = new EventEmitter<number>();
	@ViewChild('prev') prevButton: PagerButtonComponent;
	@ViewChild('next') nextButton: PagerButtonComponent;
	@ViewChildren('pg') buttons: QueryList<PagerButtonComponent>; // this may be redundant
	@Input('use-oval-button') useOvalButton: boolean = true;
	@Input('in-progress') inProgress: boolean = false;
	@Input('show-total-record') showTotalRecord: boolean = true;
	@Input('show-progress') showProgress: boolean = false; // if true a progress section template will be rendered and enabled if in progress is true
	@Input('show-next-prev') showNextPrev: boolean = true;
	@Input('next-prev-color') nextPrevColor: string = 'white';
	@Input('h-alignment') hAlignment: string = PAGER_HORIZONTAL_ALIGNMENT_CENTER;
	@Input('next-prev-color-class') nextPrevClass: string = '';
	@Input('pager-source') pagerSource: IPagerSource;
	@Input() color: string = 'blue';
	@Input('color-class') colorClass: string = '';
	@Input('button-size') buttonSize: string = BUTTON_SIZE_DEFAULT;
	@Input('auto-calculate-pages') autoCalPages: boolean = false;
	totalPages: number[] = [];
	pageIndex: number = 0;
	flexJustify: string = PAGER_HORIZONTAL_ALIGNMENT_CENTER;
	//diff : { [any : string] : KeyValueDiffer<string, IPagerSource>};
	differ: any;

	constructor(private differs: KeyValueDiffers) {
		//this.diff  = differs.find({}).create<{ [any : string] : KeyValueDiffer<string, IPagerSource>}>();
	}

	ngOnInit() {
		/*Register Observers when pagerSource changes*/
		if (this.pagerSource != undefined || this.pagerSource != null) {
			this.differ = this.differs.find(this.pagerSource).create<string, IPagerSource>();
		}
	}

	pagerButtonClick(pageIndex: number) {
		this.pageIndex = pageIndex;
		this.onPageClick.emit(pageIndex);
	}

	ngAfterViewInit(): void {
		// check if prev and next button need to be disabled
		if (this.pagerSource && this.totalPages.length > 0) {
			// this.prevButton.disableButton();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		/* Check if PagerSouce has been set and render the ui accordingly*/
		if (changes['pagerSource'] != undefined && changes['pagerSource'].isFirstChange()) {
			// generate page numbers or assign default values
			if (!this.autoCalPages) {
				if (this.pagerSource.totalPages != undefined) {
					this._generatePageIndexes(this.pagerSource.totalPages);
				}
			} else {
				//calculate the total pages automatically
				this.calTotalPages();
			}
			// console.log("NG-CHANGES called");
		}
		if (changes['hAlignment'] != undefined) {
			this.updateAlignment();
		}

		//else render a message to inform the user of the required pager source
	}

	private calTotalPages() {
		const mod = this.pagerSource.totalRecord % this.pagerSource.pageSize;
		this.pagerSource.totalPages =
			(this.pagerSource.totalRecord - mod) / this.pagerSource.pageSize + (mod > 0 ? 1 : 0);
		this._generatePageIndexes(this.pagerSource.totalPages);
	}

	gotoNextPage() {
		// got to next page only if we are not at the last page
		if (this.canGoNext()) {
			this.pageIndex += 1;
			this.pagerButtonClick(this.pageIndex);
		}
	}

	gotoPrevPage() {
		// got to next page only if we are not at the last page
		if (this.canGoPrev()) {
			this.pageIndex -= 1;
			this.pagerButtonClick(this.pageIndex);
		}
	}

	private canGoNext(): boolean {
		/*
    example : pageIndex  = 9
    * if totalPages.length  = 10 , if have index[0,1,2,3,4,5,6,7,8,9]
    * */
		return this.pageIndex < this.totalPages.length - 1;
	}

	private canGoPrev(): boolean {
		/*
    example : pageIndex  = 1
    * if totalPages.length  = 10 , if have index[0,1,2,3,4,5,6,7,8,9]
    * */
		return this.pageIndex > 0;
	}

	private _generatePageIndexes(totalPages: number) {
		let pg = [];
		for (let i: number = 0; i < totalPages; i++) {
			pg.push(i);
		}
		this.totalPages = pg;
		this.setPageIndex();
	}

	private updateAlignment() {
		switch (this.hAlignment) {
			case PAGER_HORIZONTAL_ALIGNMENT_CENTER:
				this.flexJustify = 'center';

				break;
			case PAGER_HORIZONTAL_ALIGNMENT_LEFT:
				this.flexJustify = 'start';

				break;
			case PAGER_HORIZONTAL_ALIGNMENT_RIGHT:
				this.flexJustify = 'end';

				break;
			default:
				this.flexJustify = PAGER_HORIZONTAL_ALIGNMENT_CENTER;
				break;
		}
	}

	private setPageIndex() {
		this.pageIndex = this.pagerSource.currentPage;
		//this.pagerButtonClick(this.pageIndex);
	}

	ngDoCheck(): void {
		//// console.log(this.count++);
		if (this.pagerSource != undefined || this.pagerSource != null) {
			const changedData = this.differ.diff(this.pagerSource);
			if (changedData) {
				if (changedData.isDirty) {
					if (this.autoCalPages) {
						// console.log("data changed");
						this.calTotalPages();
					} else {
						// if page Size changes do the required thing
						this.calTotalPages();
						//this._generatePageIndexes(this.pagerSource.totalPages);
					}
				}
			}
		}
	}
}
