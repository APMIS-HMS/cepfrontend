import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { HmoService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-hmo-list',
  templateUrl: './hmo-list.component.html',
  styleUrls: ['./hmo-list.component.scss']
})
export class HmoListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frmNewHmo: FormGroup;
  frmNewPlan: FormGroup;
  hmo = new FormControl('', []);
  newHmo = false;
  newHMO = false;

  constructor(private formBuilder: FormBuilder, private hmoService: HmoService) { }

  ngOnInit() {
    this.frmNewHmo = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
    });

    // this.frmNewPlan = this.formBuilder.group({
    //   plans: ['', [<any>Validators.required]]
    // });

    this.frmNewPlan = this.formBuilder.group({
      'planArray': this.formBuilder.array([
        this.formBuilder.group({
          plans: ['', [<any>Validators.required]],
          readOnly: [false]
        })
      ])
    });
  }

  newHmo_show() {
    this.newHmo = !this.newHmo;
  }

  pushNewPlan(plan: any, index) {
    // plan.readOnly = true;
    (<FormArray>this.frmNewPlan.controls['planArray']).controls.forEach(item => {
      // console.log(item)
      let g = <FormGroup>item;
      g.controls['readOnly'].setValue(true);
    });
    (<FormArray>this.frmNewPlan.controls['planArray'])
      .push(
      this.formBuilder.group({
        plans: ['', [<any>Validators.required]],
        readOnly: [false]
      })
      );
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  show_beneficiaries() {
    this.showBeneficiaries.emit(true);
  }
  onChange(e){

  }
  save(valid, value) {
    value.readOnly = true;
    console.log(valid);
    console.log(value);
    if (value.plans === undefined) {
      value.plans = [];
    }
    (<FormArray>this.frmNewPlan.controls['planArray']).controls.forEach(item => {
      if (item.valid) {
        console.log(item.value);
        value.plans.push(item.value);
      }
    })
    if(valid){
      if(value._id === undefined){
        this.hmoService.create(value).then(payload =>{
          console.log(payload);
          this.frmNewHmo.reset();
          this.frmNewPlan.reset();
        })
      }
    }
  }
}
