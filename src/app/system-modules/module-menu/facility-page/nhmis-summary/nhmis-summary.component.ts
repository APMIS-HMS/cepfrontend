import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as jspdf from 'jspdf'; 
import { html2canvas} from 'html2canvas';  

@Component({
  selector: 'app-nhmis-summary',
  templateUrl: './nhmis-summary.component.html',
  styleUrls: ['./nhmis-summary.component.scss']
})
export class NhmisSummaryComponent implements OnInit {

  filterMonth: FormControl = new FormControl();
  filterYear: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  downloadPdf(){
    var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('NHMIS.pdf'); // Generated PDF   
    });  
   
  }

}
