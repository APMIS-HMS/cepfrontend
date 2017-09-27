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
