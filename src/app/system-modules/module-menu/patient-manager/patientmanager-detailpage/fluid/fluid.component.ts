import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-fluid',
  templateUrl: './fluid.component.html',
  styleUrls: ['./fluid.component.scss']
})
export class FluidComponent implements OnInit {

  public frmIntake: FormGroup;
  public frmOutput: FormGroup;
  inInterval = new FormControl();
  outInterval = new FormControl();

  // lineChart
  public lineChartData:Array<any> = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
    [78, 68, 10, 99, 46, 37, 20],
    [68, 48, 30, 29, 86, 27, 60],
    [18, 58, 80, 49, 56, 17, 10]
  ];
  public lineChartLabels:Array<any> = ['Drip', 'Salinity', 'Alkaline', 'H20', 'Carbonozine'];
  public lineChartType:string = 'line';
 
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmIntake = this.formBuilder.group({
      infusion: ['', [<any>Validators.required]],
      infusion_volume: ['', [<any>Validators.required]]
    });

    this.frmOutput = this.formBuilder.group({
      fluid: ['', [<any>Validators.required]],
      output_volume: ['', [<any>Validators.required]]
    });
  }

}
