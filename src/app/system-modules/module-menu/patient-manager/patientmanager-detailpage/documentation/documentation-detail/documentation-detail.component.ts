import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
	Facility,
	Patient,
	Employee,
	Documentation,
	PatientDocumentation,
	Document
} from '../../../../../../models/index';
import {
	FormsService,
	FacilitiesService,
	DocumentationService
} from '../../../../../../services/facility-manager/setup/index';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-documentation-detail',
	templateUrl: './documentation-detail.component.html',
	styleUrls: [ './documentation-detail.component.scss' ]
})
export class DocumentationDetailComponent implements OnInit {
	loginEmployee: any;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() document: any = <any>{};
	@Input() isDocumentEdit: any = <any>{};
	@Input() patientDocumentationId: any;

	selectedPatientDocumentation: any;
	addendumCtrl: FormControl = new FormControl();
	selectedFacility: any;

	constructor(
		private facilityService: FacilitiesService,
		private documentationService: DocumentationService,
		private authFacadeService: AuthFacadeService,
		private locker: CoolLocalStorage
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.authFacadeService.getLogingEmployee().then((loginEmployee) => {
			this.loginEmployee = loginEmployee;
			this.getPatientDocumentation();
		});
	}
	checkType(value) {
		if (typeof value === 'string') {
			return true;
		} else if (typeof value === 'number') {
			return true;
		} else if (value.length !== undefined) {
			return true;
		}
	}
	getPatientDocumentation() {
		this.documentationService.get(this.patientDocumentationId, {}).then(
			(payload) => {
				this.selectedPatientDocumentation = payload;
				if (
					this.document.document.addendum !== undefined &&
					this.document.document.addendum.text !== undefined
				) {
					this.addendumCtrl.setValue(this.document.document.addendum.text);
				}
			},
			(error) => {}
		);
	}
	close_onClick() {
		this.closeModal.emit(true);
	}

	save() {
		if (this.addendumCtrl.valid) {
			let addendum: any = {};
			addendum.employeeId = this.loginEmployee._id;

			addendum.employeeName =
				this.loginEmployee.personDetails.title.name +
				' ' +
				this.loginEmployee.personDetails.lastName +
				' ' +
				this.loginEmployee.personDetails.firstName;
			addendum.text = this.addendumCtrl.value;
			this.documentationService
				.addAddendum(addendum, {
					query: {
						patientDocumentationId: this.selectedPatientDocumentation._id,
						documentationId: this.document._id,
						facilityId: this.selectedFacility._id
					}
				})
				.then(
					(payload) => {
						this.close_onClick();
					},
					(error) => {}
				);
		}
	}


	doc_Print(){
		const printContents = document.getElementById('printNote').innerHTML;
		const popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
		popupWin.document.write(`
		  <html>
			<head>
			  <title></title>
			  <style>

			  .tree-child{
				display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-pack: start;
					-ms-flex-pack: start;
					justify-content: flex-start;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
					z-index: 2;
					position: relative;
					padding: 10px;
				}

				.modal-baseWrap {
					width: 590px;
					padding: 10px 40px;
					// max-height: 50vh;
				}
				
				
				
				
				.modal_title {
					text-align: center;
					border: 0;
					width: 500px;
					color: #fff;
				}
				
				.cont-wrap {
					width: 100%;
					height: auto;
					max-height: 95%;
					overflow-y: auto;
				}
				
				.docCard-header {
					margin: 20px 0;
					margin-top: 3px;
				}
				
				.docCard-ctaWrap {
					top: -13px;
					bottom: auto;
				}
				
				.form-cont {
					width: 98%;
					margin-top: 12px;
					box-shadow: 20px 20px 50px 10px rgba(255, 192, 203, 0.034);
				}
				
				.but-style {
					text-align: center;
					margin-top: 15px;
					margin-bottom: 5px;
				}

				.sect-value{
					line-height: 1.7;
					margin-left: 10px;
					margin-right: 10px;
					text-align: justify;
				}
				
				table {
					width: 100%;
					position: relative;
					border-collapse: collapse;
					font-size: 1.2rem;
					border: 0.5px solid #ddd;
				}
				
				
				th {
					font-size: 1.5rem;
					text-align: left;
					font-weight: normal;
					color: #ff2500;
					border-bottom: 1px solid #ff2500;
					height: 0px;
					background: rgba(255, 255, 255, 0.15);
					border: 0.5px solid rgba(255, 255, 255, 0.15);
				}
				
				td{
					border: 0px solid transparent;
					text-align: left;
					padding: 5px;
				}
				
				.btn-primary {
					color: #fff;
					background-color: #337ab7;
					border-radius: 25px;
					padding: 13px 35px;
					border-color: none !important;
				}
				
				
				.node-child-title {
					font-size: 1.4rem;
					color: #194985;
				}
				
				
				.node-child-content {
					background: #fff;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					margin-bottom: 10px;
				}
				
				.docCard-header {
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-pack: justify;
					-ms-flex-pack: justify;
					justify-content: space-between;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
					width: 100%;
					height: 35px;
					background: #e2e2e2;
					border-bottom: 1px solid #e2e2e2;
					padding: 5px;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
				}
				
				.empWrap {
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-pack: justify;
					-ms-flex-pack: justify;
					justify-content: space-between;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
					cursor: pointer;
				}
				
				.list-img{
					width: 30px;
					height: 30px;
					border-radius: 100%;
					margin-right: 10px;
				}
				
				.val-tag {
					font-size: 0.9rem;
					color: #0288D1;
				}
				
				.list-label {
					font-size: 1.2rem;
					color: #000;
				}
				
				.docCard-header, .docCard-body {
					position: relative;
					width: 99%;
					margin: 0 auto;
				}
				
				.cardSect-wrap {
					margin-bottom: 20px;
					margin-left: 10px;
					margin-top: -10px;
				}
				.card-sect {
					margin-top: 20px;
				}
				.docCard-sectContent {
					font-size: 1.2rem;
					line-height: 1.5;
					color: #474747;
					letter-spacing: 0.3px;
				}
				
				.doc-list-wrap {
					padding-bottom: 10px;
				}
				
				.sect-key {
					font-size: 1rem;
					color: #0288D1;
					margin-top: 20px;
					text-decoration: underline;
				}
				
				.sect-value {
					line-height: 1.7;
					margin-left: 10px;
					margin-right: 10px;
					text-align: justify;
				}	
			  </style>
			</head>
			<body onload="window.print();window.close()">
			${printContents}
			</body>
		  </html>`);
		popupWin.document.close();
	  }
}
