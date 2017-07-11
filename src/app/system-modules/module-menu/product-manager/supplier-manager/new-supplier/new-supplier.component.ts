import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { SupplierService } from '../../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../../models/index';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {
  mainErr = true;
  errMsg = 'You have unresolved errors';
  loadIndicatorVisible = false;
  public frm_newSupplier: FormGroup;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedSupplier: any = <any>{};
  selectedFacility: Facility = <Facility>{};
  constructor(private formBuilder: FormBuilder, private locker: CoolSessionStorage,
    private supplierService: SupplierService) {
  }


  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    console.log(this.selectedFacility);
    this.frm_newSupplier = this.formBuilder.group({
      name: ['', [<any>Validators.required]],
      contact: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phoneNumber: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      facilityId: [this.selectedFacility._id]
    });
    this.populateSupplier();
  }
  populateSupplier() {
    if (this.selectedSupplier._id !== undefined) {
      this.frm_newSupplier.controls['name'].setValue(this.selectedSupplier.name);
      this.frm_newSupplier.controls['contact'].setValue(this.selectedSupplier.contact);
      this.frm_newSupplier.controls['email'].setValue(this.selectedSupplier.email);
      this.frm_newSupplier.controls['phoneNumber'].setValue(this.selectedSupplier.phoneNumber);
      this.frm_newSupplier.controls['address'].setValue(this.selectedSupplier.address);
    } else {
      this.frm_newSupplier.reset();
    }
  }
  close_onClick() {
    this.selectedSupplier = {};
    this.closeModal.emit(true);
  }
  create(form) {
    console.log(form);
    if (form.valid) {
      this.mainErr = true;
      console.log('creating');
      // this.supplierService.create(form.value).then(payload => {
      //   console.log('created');
      //   console.log(payload);
      //   this.frm_newSupplier.reset();
      // });

      if (this.selectedSupplier._id === undefined) {
        console.log(1)
        form.value.facilityId = this.selectedFacility._id;
        this.supplierService.create(form.value).then(payload => {
          this.frm_newSupplier.reset();
        });
      } else {
        console.log(2)
        form.value._id = this.selectedSupplier._id;
        this.supplierService.update(form.value).then(payload => {
          this.frm_newSupplier.reset();
        });
      }

    } else {
      this.mainErr = false;
    }
  }
}
