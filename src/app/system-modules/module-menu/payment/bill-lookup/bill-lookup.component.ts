import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FacilitiesService, BillingService, PatientService, InvoiceService, PersonService, PendingBillService, TodayInvoiceService
} from '../../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, Invoice, BillModel, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-bill-lookup',
  templateUrl: './bill-lookup.component.html',
  styleUrls: ['./bill-lookup.component.scss']
})
export class BillLookupComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  fundAmount: FormControl;

  public frmBillLookup: FormGroup;
  itemEdit = new FormControl('', [Validators.required, <any>Validators.pattern('/^\d+$/')]);
  itemQtyEdit = new FormControl('', [Validators.required, <any>Validators.pattern('/^\d+$/')]);
  txtSelectAll = new FormControl('', []);
  select1 = new FormControl('', []);
  select2 = new FormControl('', []);
  select3 = new FormControl('', []);
  searchPendingInvoices = new FormControl('', []);
  searchPendingBill = new FormControl('', []);
  user: User = <User>{};
  addItem = false;
  makePayment = false;
  addModefierPopup = false;
  addLineModefierPopup = false;
  priceItemDetailPopup = false;
  itemEditShow = false;
  itemEditShow2 = false;
  itemEditShow3 = false;
  selectAll = false;
  isProcessing = false;

  cat1 = false;
  cat2 = false;
  cat3 = false;

  makePayment_modal = false;

  selectedPatient: Patient = <Patient>{};
  selectedFacility: Facility = <Facility>{};
  selectedBillItem: BillModel = <BillModel>{};
  billGroups: any[] = [];
  masterBillGroups: any[] = [];
  checkBillitems: any[] = [];
  listedBillItems: any[] = [];
  invoice: Invoice = <Invoice>{ billingDetails: [], totalPrice: 0, totalDiscount: 0 };
  selectedGroup: any = <any>{};
  selectedServiceBill: any = <any>{};
  subTotal = 0;
  total = 0;
  discount = 0;
  invoiceGroups: any[] = [];
  pendingBills: any[] = [];
  loadingPendingBills: Boolean = false;
  isLoadingInvoice: Boolean = false;

  constructor(private locker: CoolLocalStorage,
    private formBuilder: FormBuilder,
    public facilityService: FacilitiesService,
    private invoiceService: InvoiceService,
    private _route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private personService: PersonService,
    private patientService: PatientService,
    private _pendingBillService: PendingBillService,
    private _todayInvoiceService: TodayInvoiceService) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.patientService.receivePatient().subscribe((payload: Patient) => {
      this.selectedPatient = payload;
      this.subTotal = 0;
      this.total = 0;
      this.discount = 0;
      this.getPatientBills();
    });

    this.invoiceService.receiveDiscount().subscribe((payload: any) => {
      const valueCheck = payload.valueCheck;
      const modifier = payload.modifier;
      if (valueCheck === 'Percentage') {
        this.discount = ((modifier / 100) * this.total);
      } else {
        this.discount = modifier;
      }
      this.reCalculateBillTotal();
    });

    this.invoiceService.receiveInvoice().subscribe((payload: any) => {
      payload.forEach((itemi, i) => {
        if (itemi.isModified !== undefined) {
          this.fixedModifiedBill(itemi);
        } else {
          this.fixedGroup(itemi);
        }
      });

    });
  }


  ngOnInit() {
    this.pageInView.emit('Generate Bill');
    this.user = <User>this.locker.getObject('auth');

    this._route.params.subscribe(params => {
      if (!!params.id && params.id !== undefined) {
        this.patientService.find({ query: { facilityId: this.selectedFacility._id, personId: params.id } }).then(res => {
          this.selectedPatient = res.data[0];
          this.getPatientBills();
        }).catch(err => console.log(err));
      }
    });

    this.itemQtyEdit.valueChanges.subscribe(value => {
      this.selectedBillItem.qty = value;
      this.selectedBillItem.amount = this.selectedBillItem.qty * this.selectedBillItem.unitPrice;
      this.reCalculateBillTotal();
    });

    this.billingService.updatelistner.subscribe(payload => {
      this.getPatientBills();
      this.selectedPatient = this.listedBillItems[0].patientItem;
    });

    this._getAllPendingBills();
    this._getAllInvoices();

    this.searchPendingInvoices.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        this.isLoadingInvoice = true;
        var facility = {
          "_id": this.selectedFacility._id,
          "isQuery": true,
          "name": value
        }
        this._todayInvoiceService.get(facility).then(payload => {
          this.invoiceGroups = payload.data.invoices;
          this.isLoadingInvoice = false;
        }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
      });

    this.searchPendingBill.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        this.loadingPendingBills = true;
        var facility = {
          "_id": this.selectedFacility._id,
          "isQuery": true,
          "name": value
        }
        this._pendingBillService.get(facility)
          .then(res => {
            this.pendingBills = res.data.bills;
            this.loadingPendingBills = false;
          }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
      });
  }

  onPersonValueUpdated(person) {
    this.selectedPatient.personDetails = person;
  }


  fixedModifiedBill(payload) {
    const groups = this.billGroups.filter(x => x.categoryId === payload.facilityServiceObject.categoryId);
    if (groups.length > 0) {
      const group = groups[0];
      group.bills.forEach((itemi, i) => {
        if (itemi._id === payload._id) {
          group.bills[i] = payload;
          this.reCalculateBillTotal();
        }
      });

    }
  }

  onGenerateInvoice() {
    if (this.checkBillitems.length > 0) {
      this.isProcessing = true;
      const billGroup: Invoice = <Invoice>{ billingIds: [] };
      billGroup.facilityId = this.selectedFacility._id;
      billGroup.patientId = this.selectedPatient._id;

      this.billGroups.forEach((itemg, g) => {
        itemg.bills.forEach((itemb: BillModel, b) => {
          if (itemb.isChecked) {
            itemb.billObject.isInvoiceGenerated = true;
            billGroup.billingIds
              .push({
                billingId: itemb._id,
                billObject: itemb.billObject
              });
          }
        });
      });

      if (billGroup.billingIds.length > 0) {
        billGroup.totalDiscount = this.discount;
        billGroup.subTotal = this.subTotal;
        billGroup.totalPrice = this.total;
        billGroup.balance = this.total;
        console.log(billGroup);
        this.invoiceService.create(billGroup).then(payload => {
          var len = this.checkBillitems.length - 1;
          var len2 = this.listedBillItems.length - 1;
          var filterCheckedBills = [];
          for (var x = len; x >= 0; x--) {
            for (var x2 = len2; x2 >= 0; x2--) {
              let len3 = this.listedBillItems[x2].billItems.length - 1;
              for (var x3 = len3; x3 >= 0; x3--) {
                if (this.listedBillItems[x2].billItems[x3]._id == this.checkBillitems[x]) {
                  this.listedBillItems[x2].billItems[x3].isInvoiceGenerated = true;
                  delete this.listedBillItems[x2].billItems[x3].paymentCompleted;
                  delete this.listedBillItems[x2].billItems[x3].paymentStatus;
                  delete this.listedBillItems[x2].billItems[x3].payments;
                  filterCheckedBills.push(this.listedBillItems[x2]);
                  if (x == 0) {
                    let len4 = filterCheckedBills.length - 1;
                    for (var x4 = len4; x4 >= 0; x4--) {
                      this.billingService.update(filterCheckedBills[x4]).then(pd => {
                      });
                    }
                  }
                }
              }
            }
          }
          this.router.navigate(['/dashboard/payment/invoice', payload.patientId]);
        }, error => {
        });
      }
    } else {
      this._notification('Info', "No bill selected")
    }
  }

  onSelectedInvoice(invoice) {
    this.router.navigate(['/dashboard/payment/invoice', invoice.personDetails._id]);
  }

  fixedGroup(bill: BillModel) {
    const existingGroupList = this.billGroups.filter(x => x.categoryId === bill.facilityServiceObject.categoryId);
    if (existingGroupList.length > 0) {
      const existingGroup = existingGroupList[0];
      if (existingGroup.isChecked) {
        bill.isChecked = true;
      }
      const existingBills = existingGroup.bills.filter(x => x.facilityServiceObject.serviceId === bill.facilityServiceObject.serviceId);
      if (existingBills.length > 0) {
        const existingBill = existingBills[0];
        existingBill.qty = existingBill.qty + bill.qty;
        existingBill.amount = existingBill.qty * existingBill.unitPrice;

        // existingGroup.total = existingGroup.total + bill.amount;
        this.subTotal = this.subTotal + existingGroup.total;
        this.total = this.subTotal - this.discount;
      } else {
        existingGroup.bills.push(bill);
        this.subTotal = this.subTotal + existingGroup.total;
        this.total = this.subTotal - this.discount;
      }
      existingGroup.isOpened = false;
      this.toggleCurrentCategory(existingGroup);
    } else {
      const group = {
        isChecked: false, total: 0, isOpened: false,
        categoryId: bill.facilityServiceObject.categoryId, category: bill.facilityServiceObject.category, bills: []
      };
      bill.isChecked = false;
      group.bills.push(bill);
      this.billGroups.push(group);
      this.total = this.subTotal - this.discount;
      group.isOpened = false;
      this.toggleCurrentCategory(group);
    }
  }

  fixedGroupExisting(bill: BillItem) {
    const inBill: BillModel = <BillModel>{};
    inBill.amount = bill.totalPrice;
    inBill.itemDesc = bill.description;
    inBill.itemName = bill.facilityServiceObject.service;
    inBill.qty = bill.quantity;
    inBill.covered = bill.covered;
    inBill.unitPrice = bill.unitPrice;
    inBill._id = bill._id;
    inBill.facilityServiceObject = bill.facilityServiceObject;
    inBill.billObject = bill;

    const existingGroupList = this.billGroups.filter(x => x.categoryId === bill.facilityServiceObject.categoryId);
    if (existingGroupList.length > 0) {
      const existingGroup = existingGroupList[0];
      if (existingGroup.isChecked) {
        bill.isChecked = true;
      }
      const existingBills = existingGroup.bills.filter(x => x.facilityServiceObject.serviceId === bill.facilityServiceObject.serviceId);
      if (existingBills.length > 100000) {
        const existingBill = existingBills[0];
        existingBill.qty = existingBill.qty + bill.quantity;
        existingBill.amount = existingBill.qty * existingBill.unitPrice;
        this.subTotal = this.subTotal + existingGroup.total;
        this.total = this.subTotal - this.discount;
      } else {
        existingGroup.bills.push(inBill);
        this.subTotal = this.subTotal + existingGroup.total;
        this.total = this.subTotal - this.discount;
      }
      existingGroup.isOpened = false;
      this.toggleCurrentCategory(existingGroup);
    } else {
      const group = {
        isChecked: false, total: 0, isOpened: false,
        categoryId: bill.facilityServiceObject.categoryId, category: bill.facilityServiceObject.category, bills: []
      };
      inBill.isChecked = false;
      group.bills.push(inBill);
      this.billGroups.push(group);
      this.billGroups.sort(p => p.categoryId);
      this.total = this.subTotal - this.discount;
      group.isOpened = false;
      this.toggleCurrentCategory(group);
    }
  }

  getBill(payload: any) {
    const bill: BillItem = <BillItem>{};
    bill.description = payload.itemDesc;
    bill.facilityServiceId = payload.service.facilityServiceId;
    bill.quantity = payload.qty;
    bill.serviceId = payload.service.serviceId;
    bill.totalPrice = payload.amount;
    bill.unitPrice = payload.unitPrice;
    return bill;
  }

  getPatientBills() {
    this.billGroups = [];
    this.masterBillGroups = [];
    this.txtSelectAll.setValue(false);
    this.billingService.find({ query: { facilityId: this.selectedFacility._id, patientId: this.selectedPatient._id, isinvoice: false } })
      .then((payload) => {
        this.listedBillItems = payload.data
        this.masterBillGroups = [];
        this.billGroups = [];
        payload.data.forEach((itemi, i) => {
          this.masterBillGroups.push(itemi);
          itemi.billItems.forEach((itemj, j) => {
            if (itemj.isInvoiceGenerated == false || itemj.isInvoiceGenerated == undefined) {
              this.fixedGroupExisting(itemj);
            }
          });
        });
      });
  }

  onClickPatientPendingBill(pendingBill: any) {
    this.selectedPatient = pendingBill.patientItem;
    this.getPatientBills();
  }


  private _getAllPendingBills() {
    this.loadingPendingBills = true;
    var facility = {
      "_id": this.selectedFacility._id,
      "isQuery": false
    }
    this._pendingBillService.get(facility)
      .then(res => {
        this.pendingBills = res.data.bills;
        this.loadingPendingBills = false;
      }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
  }

  private _getAllInvoices() {
    this.isLoadingInvoice = true;
    var facility = {
      "_id": this.selectedFacility._id,
      "isQuery": false
    }
    this._todayInvoiceService.get(facility).then(payload => {
      this.invoiceGroups = payload.data.invoices;
      this.isLoadingInvoice = false;
    }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
  }



  onRemoveDiscount() {
    this.discount = 0;
    this.reCalculateBillTotal();
  }

  reCalculateBillTotal() {
    this.subTotal = 0;
    this.total = 0;
    this.billGroups.forEach((itemi, i) => {
      itemi.total = 0;
      itemi.bills.forEach((itemj, j) => {
        if (itemj.isChecked) {
          itemi.total = itemi.total + (itemj.qty * itemj.unitPrice);
          this.subTotal = this.subTotal + (itemj.qty * itemj.unitPrice);
        }
      });
    });
    this.total = (this.subTotal - this.discount);
  }

  onRemoveBill(bill: BillModel, group: any) {
    group.bills.forEach((itemi, i) => {
      if (itemi.service.serviceId === bill.service.serviceId) {
        group.bills.splice(i, 1);
        this.reCalculateBillTotal();
      }
    });
  }
  checkAll(val: boolean) {
    this.billGroups.forEach((itemi, i) => {
      itemi.isChecked = val;
      itemi.bills.forEach((itemj, j) => {
        itemj.isChecked = val;
        if (val == true) {
          this.checkBillitems.push(itemj._id);
        } else {
          this.checkBillitems.splice(itemj._id, 1);
        }

      });
    });
    this.reCalculateBillTotal();
  }
  selectAll_change(e) {
    if (e.target.checked) {
      this.selectAll = true;
      this.checkAll(true);
    } else {
      this.selectAll = false;
      this.checkAll(false);
    }
  }
  checkGroup(event: any, group: any) {
    group.isChecked = event.target.checked;
    if (!group.isChecked) {
      this.subTotal = this.subTotal - group.total;
      this.total = this.total - group.total;
    }
    group.total = 0;
    group.bills.forEach((itemi, i) => {
      itemi.isChecked = group.isChecked;
      if (itemi.isChecked) {
        group.total = group.total + itemi.amount;
        this.subTotal = this.subTotal + itemi.amount;
        this.total = this.total + itemi.amount;
        this.checkBillitems.push(itemi._id);
      } else {
        group.total = 0;
        this.checkBillitems.splice(itemi._id, 1);
      }

    });

  }
  checkBill(event: any, bill: any, group: any) {
    bill.isChecked = event.target.checked;
    if (bill.isChecked) {
      this.checkBillitems.push(bill._id);
      group.total = group.total + bill.amount;
      this.subTotal = this.subTotal + bill.amount;
      this.total = this.total + bill.amount;
    } else {
      group.total = group.total - bill.amount;
      this.subTotal = this.subTotal - bill.amount;
      this.total = this.total - bill.amount;
      this.checkBillitems.splice(bill._id, 1);
    }
    this.unCheckGroupIfEmpty(group);
  }
  unCheckGroupIfEmpty(group) {
    const checkedBills = group.bills.filter(x => x.isChecked);
    if (checkedBills.length < group.bills.length) {
      group.isChecked = false;
    } else if (checkedBills.length === group.bills.length) {
      group.isChecked = true;
    }
  }
  toggleCurrentCategory(group: any) {
    this.selectedGroup = group;
    this.selectedGroup.isOpened = !this.selectedGroup.isOpened;
  }
  isCurrentCategory(group: any) {
    if (group.isOpened) {
      return true;
    }
    return this.selectedGroup.categoryId === group.categoryId && this.selectedGroup.isOpened;
  }
  isCurrentBill(bill: BillModel, group: any) {
    this.selectedGroup = group;
    if (this.selectedBillItem === undefined || this.selectedBillItem.facilityServiceObject === undefined) {
      return false;
    }
    return this.selectedBillItem._id === bill._id;
  }
  toggleCat2() {
    this.cat2 = !this.cat2;
  }
  toggleCat3() {
    this.cat3 = !this.cat3;
  }
  itemEditToggle(bill: BillModel) {
    this.itemEditShow = !this.itemEditShow;
    this.selectedBillItem = bill;
    if (!this.itemEditShow) {
      this.selectedBillItem = <BillModel>{};
    }
    if (!this.itemEditShow) {
      this.masterBillGroups.forEach((itemi, i) => {
        itemi.billItems.forEach((itemy, y) => {
          if (itemy._id === bill._id) {
            itemy.quantity = bill.qty;
            itemy.totalPrice = bill.amount;
            itemy.unitPrice = bill.unitPrice;
            this.billingService.update(itemi).then(payload => {
            });
          }
        });
      });
    }
  }

  // Notification
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  itemEditToggle2() {
    this.itemEditShow2 = !this.itemEditShow2;
  }
  itemEditToggle3() {
    this.itemEditShow3 = !this.itemEditShow3;
  }
  addModefier() {
    this.addModefierPopup = true;
  }
  lineModifier_show(bill: BillModel) {
    this.selectedServiceBill = bill;
    this.addLineModefierPopup = true;
  }
  addItem_show() {
    this.addItem = true;
  }
  itemDetail(bill: any) {
    this.selectedServiceBill = bill;
    this.priceItemDetailPopup = true;
  }
  makePayment_onclick() {
    if (this.total != 0 && this.total != undefined) {
      if (this.selectedPatient.personDetails.wallet.balance < this.total) {
        this._notification('Info', "You donot have sufficient balance to make this payment")
      } else {
        this.makePayment = true;
      }
    } else {
      this._notification('Info', "You cannot make payment for a Zero cost service, please select bill");
    }
  }
  close_onClick(e) {
    this.addModefierPopup = false;
    this.addLineModefierPopup = false;
    this.addItem = false;
    this.priceItemDetailPopup = false;
    this.makePayment = false;
    this.makePayment_modal = false;
  }
  fundWallet_pop() {
    this.makePayment_modal = true;
  }
}
