import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
	selector: 'app-print-documentation',
	templateUrl: './print-documentation.component.html',
	styleUrls: [ './print-documentation.component.scss' ]
})
export class PrintDocumentationComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() patientDocumentation: any = <any>{};
	@Input() patient: any = <any>{};
	constructor() {}

	ngOnInit() {
		console.log(this.patientDocumentation);
		console.log(this.patient);
	}

	onClickPrintDocument() {
		const printContents = document.getElementById('printDoc-Section').innerHTML;
		let popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
		popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
            table{
              width: 100%;
              position: relative;
              border-collapse: collapse;
              font-size: 1.2rem;
            }
            table, td { 
                border: 0.5px solid #ddd;
            } 
            th {
                height: 50px;
                background: transparent;
                border: 0.5px solid #ddd;
            }
            td {
                vertical-align: center;
                text-align: left;
                padding: 5px;
            }
            tr:nth-child(even) {background-color: #f8f8f8}
            .print-header{
              display:flex;
              Justify-content:space-between;
              margin-bottom:40px;
              background-color:#eee;
              width:100%;
            }

            .txt-wrap{
              display:inline-block;
          }
          .top-bio{
            text-align: center;
            align-items: center;
            box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
            padding: 5px;
            width: auto;
            height: auto;
            margin: 10px;
            display: grid;
            justify-content: center;
            flex-wrap: wrap;            
        }
        .docPreview{
          display: grid;
          grid-template-rows: 40% 60%;
          grid-gap: 1em;
          background: white;
          border-radius: 5px;
          padding: 10px;
          overflow: auto;
      }
      .doc-content{
        border-radius: 5px;
    }
    .control-group{
      vertical-align: top;
      text-align: left;
      padding: 20px 20px 20px 30px;
      height: auto;
      margin: 0px 10px 10px 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .control-group-header{
      max-height: 30px;
      background: rgba(211, 211, 211, 0.719);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 5px;
    }
    .secWrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 5px;
  }
  .doc-span{
    font-weight: bold;
    text-decoration: underline;
}

.doc-con{
  padding-top: 10px;
}

.doc-p{
    padding: 0px 10px 10px 10px;
    text-align: justify;
}



          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`);
		popupWin.document.close();
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
