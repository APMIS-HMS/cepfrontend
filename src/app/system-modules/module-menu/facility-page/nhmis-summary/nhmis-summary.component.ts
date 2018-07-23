import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-nhmis-summary',
  templateUrl: './nhmis-summary.component.html',
  styleUrls: ['./nhmis-summary.component.scss']
})
export class NhmisSummaryComponent implements OnInit {

  filterMonth: FormControl = new FormControl();
  filterYear: FormControl = new FormControl();
  // dd = { content: document.getElementById('contentToConvert') };

  constructor() { 
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
  }

  generatePdf(){ 
    pdfMake.createPdf({content: document.getElementById('contentToConvert')}).open();
  }

}
