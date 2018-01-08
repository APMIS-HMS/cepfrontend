import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ElementRef
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  FacilitiesService,
  FacilitiesServiceCategoryService
} from '../../../../../services/facility-manager/setup/index';
@Component({
  selector: 'app-template-procedure',
  templateUrl: './template-procedure.component.html',
  styleUrls: ['./template-procedure.component.scss']
})
export class TemplateProcedureComponent implements OnInit {
  addProcedureForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'facilityservices';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';
  cuDropdownLoading: boolean = false;
  results: any = [];
  newTemplate = true;

  constructor(
    private _fb: FormBuilder,
    // private _socketService: SocketService,
    // private _restService: RestService,
    private _facilityServiceCategoryService: FacilitiesServiceCategoryService
  ) {
    this.apmisLookupQuery = {
      query: {
        'categories.name': 'Procedure',
        $select: { 'categories.$': 1 }
      }
    };
    this._facilityServiceCategoryService
      .find({
        query: {
          'categories.name': 'Procedure',
          'categories.services.name': 'Minor Wound Dressing',
          $select: { 'categories.services.$': 1 }
        }
      })
      .then(
        payload => {
          console.log(payload);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.addProcedureForm = this._fb.group({
      procedure: ['', [<any>Validators.required]]
    });

    // this.addProcedureForm.controls["procedure"].valueChanges
    //   .debounceTime(200)
    //   .distinctUntilChanged()
    //   .switchMap(value => this._socket.find(query))
    //   .subscribe((payload: any) => {
    //     console.log(payload);
    //     this.cuDropdownLoading = false;
    //     if (payload !== undefined && payload.data !== undefined) {
    //       this.results = payload.data;
    //     } else {
    //       this.results = payload;
    //     }
    //   });
  }

  // onClickAddPhysicianOrder(valid: boolean, value: any) {
  //   if (valid) {
  //     const physicianOrder = {
  //       name: value.physicianOrder,
  //       comment: '',
  //       status: 'Not Done',
  //       completed: false
  //     };

  //   //   if (this.physicianOrders.length > 0) {
  //   //     // Check if generic has been added already.
  //   //     const containsGeneric = this.physicianOrders.filter(x => x.name === value.physicianOrder);
  //   //     if (containsGeneric.length < 1) {
  //   //       this.physicianOrders.push(physicianOrder);
  //   //       this._orderSetSharedService.saveItem({ physicianOrders: this.physicianOrders });
  //   //     }
  //   //   } else {
  //   //     this.physicianOrders.push(physicianOrder);
  //   //     this._orderSetSharedService.saveItem({ physicianOrders: this.physicianOrders});
  //   //   }
  //   //   this.addPhysicianOrderForm.reset();
  //   }
  // }

  apmisLookupHandleSelectedItem(value) {
    console.log(value);
  }

  // onSelectedItem(item) {
  //   console.log(item);
  // }

  onClickAddProcedure(valid: boolean, value: any) {
    console.log(value);
  }
}
