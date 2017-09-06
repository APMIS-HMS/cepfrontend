import { HmoService } from './../../../../../services/facility-manager/setup/hmo.service';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-beneficiary-list',
  templateUrl: './beneficiary-list.component.html',
  styleUrls: ['./beneficiary-list.component.scss']
})
export class BeneficiaryListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  public frmNewHmo: FormGroup;
  hmo = new FormControl('', []);
  newHmo = false;
  selectedFacility: any = <any>{};
  beneficiaries:any[] = [];
  selectedHMO:any = <any>{};

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private locker: CoolSessionStorage,
    private hmoService: HmoService) { }

  ngOnInit() {
    this.selectedFacility = this.locker.getObject('selectedFacility');
    this.frmNewHmo = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
      plans: ['', [<any>Validators.required]]
    });


    this.route.params.subscribe(parameters => {
      this.getBeneficiaryList(parameters.id);
    })
  }
  getBeneficiaryList(id) {
    this.hmoService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then(payload => {
      console.log(payload);
      if(payload.data.length > 0){
        let facHmo = payload.data[0];
        const index = facHmo.hmos.findIndex(x => x.hmo._id === id);
        if(index > -1){
          if( facHmo.hmos[index].enrolleeList.length > 0){
            this.selectedHMO = facHmo.hmos[index].hmo;
            console.log(this.selectedHMO);
            this.beneficiaries= facHmo.hmos[index].enrolleeList[0].enrollees;
            console.log(this.beneficiaries[0]);
          }
        }
      }
    })
  }
  getRole(beneficiary){
    let filNo = beneficiary.filNo;
    if(filNo !== undefined){
      const filNoLength = filNo.length;
      const lastCharacter = filNo[filNoLength-1];
     return isNaN(lastCharacter) ? 'D':'P';
    }
  }
  newHmo_show() {
    this.newHmo = !this.newHmo;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

}
