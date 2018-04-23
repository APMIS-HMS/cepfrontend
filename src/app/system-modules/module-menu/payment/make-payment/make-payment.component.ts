import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService, MakePaymentService, FacilitiesService, PersonService, EmployeeService } from '../../../../services/facility-manager/setup/index';
import {
  WalletTransaction, TransactionType, EntityType, TransactionDirection, TransactionMedium, TransactionStatus, PaymentPlan
} from './../../../../models/facility-manager/setup/wallet-transaction';
import { Patient, Facility, BillItem, Invoice, BillModel, User, Employee } from '../../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

import { PaymentChannels } from '../../../../shared-module/helpers/global-config'

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})

export class MakePaymentComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() personValueChanged = new EventEmitter();
  @Input() selectedPatient: any = <any>{};
  @Input() checkBillitems: any = <any>{};
  @Input() listedBillItems: any = <any>{};
  @Input() billGroups: any = <any>{};
  @Input() cost = 0;
  @Input() discount: any = <any>{};
  @Input() subTotal: any = <any>{};
  @Input() invoice: any = <any>{};
  @Input() isInvoicePage: any = <any>{};
  isPartPay = true;
  isPartPayInsurance = true;
  isWaved = false;
  isExact = true;
  isExactInsurance = false;
  isExactCompany = false;
  isExactFamily = false;
  checkAllWaive = new FormControl();
  loginEmployee: Employee = <Employee>{};
  totalAmountPaid = 0;
  totalAmountBalance = 0;
  outOfPocketAmountPaid = 0;
  paymentChannels = PaymentChannels;
  selectedFacility: Facility = <Facility>{};
  selectedBillItem: BillModel = <BillModel>{};
  productTableForm: FormGroup;
  user: any = <any>{};
  disableBtn = true;
  isProcessing = false;
  isCash = false;

  loading = false;
  tabWallet = true;
  tabInsurance = false;
  tabCompany = false;
  tabFamily = false;

  transaction: WalletTransaction = <WalletTransaction>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';
  successMsg = 'Operation completed successfully';
  InvoiceTotal = 5000;
  bAmount;
  success = false;
  public frmMakePayment: FormGroup;

  patientInsuranceLists = [];
  patientCompanyLists = [];
  patientFamilyLists = [];

  balance;
  wavedDescription = new FormControl('', []);
  amount = new FormControl('', []);
  selectOutOfPocket = new FormControl();
  selectWaved = new FormControl();
  amountInsurance = new FormControl('', []);
  balanceInsurance = new FormControl('', []);
  amountCompany = new FormControl('', []);
  balanceCompany = new FormControl('', []);
  amountFamily = new FormControl('', []);
  balanceFamily = new FormControl('', []);

  companyPlan = new FormControl('', []);
  familyPlan = new FormControl('', []);
  insurancePlan = new FormControl('', []);

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private _invoiceService: InvoiceService,
    private toastr: ToastsManager,
    private _makePaymentService: MakePaymentService,
    private facilityService: FacilitiesService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private systemModuleService: SystemModuleService) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');

  }
  ngOnInit() {
    this.user = <any>this.locker.getObject('auth');
    this.checkAllWaive.setValue(false);
    this.getPatientCovers();
    this.balance = new FormControl(this.cost, []);
    this.balanceInsurance = new FormControl(this.cost, []);
    this.balanceCompany = new FormControl(this.cost, []);
    this.balanceFamily = new FormControl(this.cost, []);
    if (this.isExact === true) {
      this.amount.setValue(this.cost);
      this.balance.setValue(0);
    }
    this.amount.valueChanges.subscribe(value => {
      const bal = this.cost - value;
      if (bal >= 0) {
        this.balance.setValue(bal);
      } else {
        this.amount.setValue(this.cost);
        this.systemModuleService.announceSweetProxy('Balance cannot be lesser than zero', 'error');
      }
    });
    this.amountInsurance.valueChanges.subscribe(value => {
      const bal = this.cost - value;
      if (bal >= 0) {
        this.balanceInsurance.setValue(bal);
      } else {
        this.amountInsurance.setValue(this.cost);
        this.systemModuleService.announceSweetProxy('Balance cannot be lesser than zero', 'error');
      }
    });

    this.amountCompany.valueChanges.subscribe(value => {
      const bal = this.cost - value;
      if (bal >= 0) {
        this.balanceCompany.setValue(bal);
      } else {
        this.amountCompany.setValue(this.cost);
        this.systemModuleService.announceSweetProxy('Balance cannot be lesser than zero', 'error');
      }
    });

    this.amountFamily.valueChanges.subscribe(value => {
      const bal = this.cost - value;
      if (bal >= 0) {
        this.balanceFamily.setValue(bal);
      } else {
        this.amountFamily.setValue(this.cost);
        this.systemModuleService.announceSweetProxy('Balance cannot be lesser than zero', 'error');
      }
    });

    this.checkAllWaive.valueChanges.subscribe(value => {
      if (value) {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item: any, i) => {
          item.value.isWaiver = true;
          item.controls.amountPaid.setValue(0);
        });
        if ((<FormArray>this.productTableForm.controls['productTableArray']).controls.length === 1) {
          (<FormArray>this.productTableForm.controls['productTableArray']).controls[0].value.isWaiver = true;
          (<FormArray>this.productTableForm.controls['productTableArray']).controls[0].value.amountPaid = 0;
        }
      } else {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item: any, i) => {
          item.value.isWaiver = false;
          item.controls.amountPaid.setValue('');
        });
        if ((<FormArray>this.productTableForm.controls['productTableArray']).controls.length === 1) {
          (<FormArray>this.productTableForm.controls['productTableArray']).controls[0].value.isWaiver = false;
          (<FormArray>this.productTableForm.controls['productTableArray']).controls[0].value.amountPaid = 0;
        }
      }
      (<FormArray>this.productTableForm.controls['productTableArray']).setValue(JSON.parse(JSON.stringify((<FormArray>this.productTableForm.controls['productTableArray']).value)))

    });

    this.selectOutOfPocket.valueChanges.subscribe(value => {
      this.totalAmountPaid = 0;
      this.totalAmountBalance = 0;
      if (value) {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item: any, i) => {
          item.value.isWaiver = false;
          item.controls.amountPaid.setValue(item.value.totalPrice);
          item.controls.balance.setValue(0);
          item.controls.isPaymentCompleted.setValue(true);
        });
      } else {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item: any, i) => {
          item.value.isWaiver = false;
          item.controls.amountPaid.setValue(0);
          item.controls.balance.setValue(item.value.totalPrice);
          item.controls.isPaymentCompleted.setValue(false);
        });
      }
      (<FormArray>this.productTableForm.controls['productTableArray']).setValue(JSON.parse(JSON.stringify((<FormArray>this.productTableForm.controls['productTableArray']).value)))

    });


    // this.channel.valueChanges.subscribe(value => {
    //   this.disableBtn = false;
    //   if (value == "Cash") {
    //     this.isCash = true;
    //   } else {
    //     this.isCash = false;
    //   }
    // });
    this.initializeServiceItemTables();
    this.setValueForServiceItems();
  }

  initializeServiceItemTables() {
    this.productTableForm = this.formBuilder.group({
      'productTableArray': this.formBuilder.array([
        this.formBuilder.group({
          date: ['', [<any>Validators.required]],
          balance: [0, [<any>Validators.required]],
          totalPrice: [0, [<any>Validators.required]],
          isPaymentCompleted: [false, [<any>Validators.required]],
          qty: [0, [<any>Validators.required]],
          facilityServiceObject: [{}, [<any>Validators.required]],
          amountPaid: [0, [<any>Validators.required]],
          isWaiver: [false, [<any>Validators.required]],
          waiverComment: ['', [<any>Validators.required]],
          createdBy: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }

  setValueForServiceItems() {
    let ItemGroupByService = [];
    if (this.isInvoicePage === false) {
      this.billGroups.forEach(element => {
        element.bills.forEach(element2 => {
          if (element2.isChecked === true) {
            const index = ItemGroupByService.filter(x =>
              x.facilityServiceObject.serviceId.toString() === element2.facilityServiceObject.serviceId.toString()
              && x.facilityServiceObject.categoryId.toString() === element2.facilityServiceObject.categoryId.toString());
            if (index.length === 0) {
              ItemGroupByService.push({
                date: element2.billObject.updatedAt,
                qty: element2.qty,
                facilityServiceObject: element2.facilityServiceObject,
                balance: element2.qty * element2.unitPrice,
                totalPrice: element2.qty * element2.unitPrice,
                amountPaid: 0,
                isPaymentCompleted: false,
                isWaiver: false,
                waiverComment: ''
              });
            } else {
              index[0].qty += element2.qty;
              index[0].balance = index[0].qty * element2.unitPrice;
              index[0].totalPrice = index[0].qty * element2.unitPrice
            }
          }
        });
      });
    } else {
      this.invoice.payments.forEach(element2 => {
        let itemBalance = 0;
        if(!element2.isPaymentCompleted && element2.isItemTxnClosed === undefined){
          ItemGroupByService.push({
            date: element2.paymentDate,
            qty: element2.qty,
            facilityServiceObject: element2.facilityServiceObject,
            balance: element2.balance,
            totalPrice: element2.balance,
            amountPaid: 0,
            isPaymentCompleted: false,
            isWaiver: false,
            waiverComment: ''
          });
        }
      });
    }
    this.employeeService.find({ query: { facilityId: this.selectedFacility._id, personId: this.user.personId } })
      .then(employee => {
        ItemGroupByService.forEach(item => {
          (<FormArray>this.productTableForm.controls['productTableArray'])
            .push(
              this.formBuilder.group({
                paymentDate: new Date,
                date: item.date,
                qty: item.qty,
                facilityServiceObject: item.facilityServiceObject,
                amountPaid: 0,
                totalPrice: item.totalPrice,
                balance: item.balance,
                isPaymentCompleted: item.isPaymentCompleted,
                isWaiver: false,
                waiverComment: '',
                createdBy: employee.data[0]._id
              })
            );
        });
      });

  }

  getPatientCovers() {
    if (this.selectedPatient.paymentPlan !== undefined) {
      this.patientInsuranceLists = this.selectedPatient.paymentPlan.filter(x => x.planType === PaymentPlan.insurance);
      this.patientCompanyLists = this.selectedPatient.paymentPlan.filter(x => x.planType === PaymentPlan.company);
      this.patientFamilyLists = this.selectedPatient.paymentPlan.filter(x => x.planType === PaymentPlan.family);
    } else {
      this.systemModuleService.announceSweetProxy('No payment plan is attached to patient', 'error', null, null, null, null, null, null, null);
    }
  }

  onChangeAmount(item) {
    let val = item.value.totalPrice - item.value.amountPaid;
    if (val >= 0 && val < item.value.totalPrice) {
      item.controls.balance.setValue(val);
      if (val === 0) {
        item.controls.isPaymentCompleted.setValue(true);
      } else {
        item.controls.isPaymentCompleted.setValue(false);
      }
    } else if (val === item.value.totalPrice) {
      item.controls.amountPaid.setValue(0);
    }
    else {
      this.systemModuleService.announceSweetProxy('Amount cannot be greater than it service price', 'error', null, null, null, null, null, null, null);
      item.controls.balance.setValue(item.value.totalPrice);
      item.controls.amountPaid.setValue(0);
    }
  }

  onChangeWaiver(item) {
    if (item.value.isWaiver) {
      item.controls.amountPaid.setValue(0);
      if ((<FormArray>this.productTableForm.controls['productTableArray']).controls.length === 1) {
        this.checkAllWaive.setValue(true);
      }
    } else {
      item.controls.amountPaid.setValue(0);
      if ((<FormArray>this.productTableForm.controls['productTableArray']).controls.length === 1) {
        this.checkAllWaive.setValue(false);
      }
    }
  }


  close_onClick() {
    this.cost = 0;
    this.closeModal.emit(true);
  }

  tabWallet_click() {
    this.tabWallet = true;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabCompany_click() {
    this.tabWallet = false;
    this.tabCompany = true;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabFamily_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = true;
    this.tabInsurance = false;
    const plan = this.selectedPatient.paymentPlan.filter(x => x.planType === PaymentPlan.family);
    if (plan.length === 0) {
      this.tabFamily = false;
      this.tabWallet = true;
      this.systemModuleService.announceSweetProxy
        ('This patient has not subscribed to any family cover. Contact your Health Insurance officer for more info', 'error');
    }
  }
  tabInsurance_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = true;
  }

  getTotalAmounBAlance() {
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item: any, i) => {
      this.totalAmountPaid += item.value.amountPaid;
      this.totalAmountBalance += item.value.balance;
    });
  }

  onOutOfPocket() {
    this.getTotalAmounBAlance();
    if (this.productTableForm.controls['productTableArray'].valid) {
      if (this.selectedPatient.personDetails.wallet !== undefined) {
        if (this.selectedPatient.personDetails.wallet.balance < this.totalAmountPaid && !this.checkAllWaive.value) {
          this.systemModuleService.announceSweetProxy('No sufficient balance to make this payment', 'info');
        } else {
          let paymentValue = {};
          const plan = this.selectedPatient.paymentPlan.filter(x => x.planType === PaymentPlan.outOfPocket);
          paymentValue = {
            'paymentMethod': plan[0],
            'amountPaid': this.totalAmountPaid
          }
          this.makePayment(paymentValue);
        }
      } else {
        this.systemModuleService.announceSweetProxy('You do not have sufficient balance to make this payment', 'info');
      }
    } else {
      this.systemModuleService.announceSweetProxy('Please enter a valid amount', 'Error');
    }
  }



  makePayment(val) {
    this.isProcessing = true;
    let paymantObj: any = {};
    if (this.isInvoicePage === false) {
      paymantObj = {
        'inputedValue': {
          'paymentMethod': val.paymentMethod,
          'amountPaid': val.amountPaid,
          'balance': this.totalAmountBalance,
          'cost': this.cost,
          'isWaved': this.checkAllWaive.value,
          'transactionType': TransactionType[TransactionType.Dr],
          'paymentTxn': this.productTableForm.controls['productTableArray'].value
        },
        'billGroups': this.billGroups,
        'patientId': this.selectedPatient._id,
        'personId': this.selectedPatient.personDetails._id,
        'facilityId': this.selectedFacility._id,
        'discount': this.discount,
        'subTotal': this.subTotal,
        'checkBillitems': this.checkBillitems,
        'listedBillItems': this.listedBillItems,
        'isInvoicePage': false
      }
      if (this.checkAllWaive.value) {
        paymantObj.reason = this.wavedDescription.value;
      }
      if (this.totalAmountBalance === 0) {
        paymantObj.transactionStatus = TransactionStatus.Complete;
      }
    } else {
      paymantObj = {
        'inputedValue': {
          'paymentMethod': val.paymentMethod,
          'amountPaid': this.totalAmountPaid,
          'balance': this.totalAmountBalance,
          'cost': this.cost,
          'isWaved': this.checkAllWaive.value,
          'transactionType': TransactionType[TransactionType.Dr],
          'paymentTxn': this.productTableForm.controls['productTableArray'].value
        },
        'invoice': this.invoice,
        'patientId': this.selectedPatient._id,
        'personId': this.selectedPatient.personDetails._id,
        'facilityId': this.selectedFacility._id,
        'isInvoicePage': true
      }
      if (this.checkAllWaive.value) {
        paymantObj.reason = this.wavedDescription.value;
      }
      if (this.totalAmountBalance === 0) {
        paymantObj.transactionStatus = TransactionStatus.Complete;
      }
    }
    if (this.checkAllWaive.value === true && this.wavedDescription.value.length > 0) {
      this._makePaymentService.create(paymantObj).then(payload => {
        this.personValueChanged.emit(payload);
        this.isProcessing = false;
        this.balance.setValue(0);
        this.close_onClick();
        if (!payload.isWaved) {
          this.systemModuleService.announceSweetProxy('Payment has been made successfully.', 'success');
        } else {
          this.systemModuleService.announceSweetProxy('Payment has been made successfully.', 'success');
        }

      }, error => {
        this.systemModuleService.announceSweetProxy('Failed to make payment. Please try again later', 'error');
      });
    } else if (this.checkAllWaive.value === false && this.wavedDescription.value.length === 0) {
      this._makePaymentService.create(paymantObj).then(payload => {
        this.personValueChanged.emit(payload);
        this.isProcessing = false;
        this.balance.setValue(0);
        this.close_onClick();
        if (!payload.isWaved) {
          this.systemModuleService.announceSweetProxy('Payment has been made successfully.', 'success');
        } else {
          this.systemModuleService.announceSweetProxy('Payment has been made successfully.', 'success');
        }

      }, error => {
        this.isProcessing = false;
        this.systemModuleService.announceSweetProxy('Failed to make payment. Please try again later', 'error');
      });
    } else {
      this.isProcessing = false;
      this.systemModuleService.announceSweetProxy('Kindly give a reason to waive this payment', 'error');
    }

  }

  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

}
