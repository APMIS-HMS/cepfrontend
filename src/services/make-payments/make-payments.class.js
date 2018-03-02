/* eslint-disable no-unused-vars */
const tokenLabel = require('../../parameters/token-label');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const ref = generateOtp();
    const billingsService = this.app.service('billings');
    const invoicesService = this.app.service('invoices');
    const facilitiesService = this.app.service('facilities');
    const getTokenService = this.app.service('get-tokens');
    const peopleService = this.app.service('people');
    let description = '';

    if (data.isInvoicePage == false) {
      const tokenPayload = await getTokenService.get(tokenLabel.tokenType.invoiceNo, {});
      let billGroup = {
        billingIds: []
      };
      console.log(1);
      billGroup.facilityId = data.selectedFacility._id;
      console.log(2);
      billGroup.patientId = data.selectedPatient._id;
      console.log(3);
      data.billGroups.forEach((itemg, g) => {
        console.log("Inside data bill Group");
        itemg.bills.forEach((itemb, b) => {
          console.log("Inside data bill Group 2");
          if (itemb.isChecked) {
            console.log("Inside data bill Group----check");
            if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
              console.log("Inside data bill Group---Service Enjoyed");
              itemb.billObject.isServiceEnjoyed = true;
            }
            if (data.inputedValue.balance == 0) {
              console.log("Inside data bill Group---payment Completed");
              itemb.billObject.paymentCompleted = true;
            }
            itemb.billObject.isServiceEnjoyed = true;
            console.log(4);
            itemb.billObject.isInvoiceGenerated = true;
            console.log(5);
            itemb.billObject.updatedAt = new Date;
            console.log(6);
            description += itemb.billObject.facilityServiceObject.category + '-' + itemb.billObject.facilityServiceObject.service;
            console.log(7);
            billGroup.billingIds.push({
              billingId: itemb._id,
              billObject: itemb.billObject,
              billModelId: itemb.billModelId
            });
            console.log(8);
            console.log("------------------Start Details of Bill group-------------------");
            console.log(billGroup);
            console.log("------------------End Details of Bill group-------------------");
          }
        });
      });

      if (billGroup.billingIds.length > 0) {
        console.log("Bill group billingIds length is greater Zero");
        billGroup.payments = [];
        console.log(9);
        billGroup.totalDiscount = data.discount;
        console.log(10);
        billGroup.subTotal = data.subTotal;
        console.log(11);
        billGroup.totalPrice = data.inputedValue.cost;
        console.log(12);
        billGroup.balance = data.inputedValue.balance;
        console.log(13);
        billGroup.invoiceNo = tokenPayload.result;
        console.log(14);
        data.inputedValue.paymentMethod.reason = data.reason;
        console.log(15);
        billGroup.payments.push({
          'amountPaid': data.inputedValue.amountPaid,
          'description': description,
          'paymentMethod': data.inputedValue.paymentMethod,
          'balance': data.inputedValue.balance,
          'createdAt': new Date
        });
        console.log(16);
        if (data.inputedValue.balance == 0) {
          billGroup.paymentStatus = 'PAID';
          billGroup.paymentCompleted = true;
        }
        console.log(17);
        if (data.inputedValue.isWaved == true) {
          data.invoice.paymentStatus = 'WAIVED';
        }
        console.log(18);
        const awaitBillGroup = await invoicesService.create(billGroup);
        console.log(19);
        const len = data.checkBillitems.length - 1;
        console.log(20);
        const len2 = data.listedBillItems.length - 1;
        console.log(21);
        let filterCheckedBills = [];
        console.log(22);
        for (var x = len; x >= 0; x--) {
          console.log(23);
          for (var x2 = len2; x2 >= 0; x2--) {
            console.log(24);
            let len3 = data.listedBillItems[x2].billItems.length - 1;
            console.log(25);
            for (var x3 = len3; x3 >= 0; x3--) {
              console.log(26);
              if (data.listedBillItems[x2].billItems[x3]._id == data.checkBillitems[x]) {
                console.log(27);
                data.listedBillItems[x2].billItems[x3].isInvoiceGenerated = true;
                console.log(28);
                if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
                  console.log(29);
                  data.listedBillItems[x2].billItems[x3].isServiceEnjoyed = true;
                  console.log(30);
                }
                if (data.inputedValue.balance == 0) {
                  console.log(31);
                  data.listedBillItems[x2].billItems[x3].paymentCompleted = true;
                  console.log(32);
                }
                data.listedBillItems[x2].billItems[x3].isServiceEnjoyed = true;
                console.log(33);
                filterCheckedBills.push(data.listedBillItems[x2]);
                console.log(34);
                if (x == 0) {
                  console.log(35);
                  let len4 = filterCheckedBills.length;
                  console.log(36);
                  let pds = [];
                  console.log(37);
                  console.log();
                  for (let _indx = 0; _indx < len4; _indx++) {
                    console.log(38);
                    console.log(bill);
                    const pd = await billingsService.patch(bill._id, {
                      billItems: filterCheckedBills[_indx].billItems
                    });
                    console.log(39);
                    pds.push(pd);
                    console.log(40);
                  }
                  if (data.inputedValue.isWaved != true) {
                    console.log(41);
                    data.invoice = awaitBillGroup;
                    console.log(42);
                    return onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan);
                    console.log(43);
                  } else {
                    console.log(44);
                    pd.isPaid = false;
                    console.log(45);
                    pd.isWaved = true;
                    console.log(46);
                    let returnObj = {
                      bill: pds,
                      invoice: awaitBillGroup
                    };
                    console.log(47);
                    return returnObj;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      if (data.inputedValue.balance == 0) {
        data.invoice.paymentCompleted = true;
        data.invoice.paymentStatus = 'PAID';
      }
      if (data.inputedValue.isWaved == true) {
        data.invoice.paymentStatus = 'WAIVED';
      }
      let invLen = data.invoice.billingIds.length - 1;
      for (let v = invLen; v >= 0; v--) {
        data.invoice.billingIds[v].billObject.isServiceEnjoyed = true;
        if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
          data.invoice.billingIds[v].billObject.isServiceEnjoyed = true;
        }
        if (data.inputedValue.balance == 0) {
          data.invoice.billingIds[v].billObject.paymentCompleted = true;
        }
        description += data.invoice.billingIds[v].billObject.facilityServiceObject.category + ' - ' + data.invoice.billingIds[v].billObject.facilityServiceObject.service;
      }

      data.invoice.balance = data.inputedValue.balance;
      data.inputedValue.paymentMethod.reason = data.reason;
      data.invoice.payments.push({
        'amountPaid': data.inputedValue.amountPaid,
        'paymentMethod': data.inputedValue.paymentMethod,
        'description': description,
        'balance': data.inputedValue.balance,
        'createdAt': new Date
      });
      const patechedInvoice = invoicesService.patch(data.invoice._id, {
        billingIds: data.invoice.billingIds,
        balance: data.invoice.balance,
        payments: data.invoice.payments,
        paymentStatus: data.invoice.paymentStatus,
        paymentCompleted: data.invoice.paymentCompleted
      });
      let len5 = patechedInvoice.billingIds.length - 1;
      for (let m = len5; m >= 0; m--) {
        const itemBill = billingsService.get(patechedInvoice.billingIds[m].billModelId, {});
        let len6 = itemBill.billItems.length - 1;
          for (let n = len6; n >= 0; n--) {
            if (itemBill.billItems[n]._id.toString() == patechedInvoice.billingIds[m].billingId.toString()) {
              if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
                itemBill.billItems[n].isServiceEnjoyed = true;
              }
              if (data.inputedValue.balance == 0) {
                itemBill.billItems[n].paymentCompleted = true;
              }
              itemBill.billItems[n].isServiceEnjoyed = true;
              if (n == 0) {
                await billingsService.patch(itemBill._id, {
                  billItems: itemBill.billItems
                });
              }
              if (m == 0) {
                if (data.inputedValue.isWaved != true) {
                  data.currentInvoice = patechedInvoice;
                  onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan);
                } else {
                  itemBill.isPaid = false;
                  itemBill.isWaved = true;
                  itemBill.paidStatus = 'WAIVED';
                  let returnObj = {
                    bill: itemBill,
                    invoice: patechedInvoice
                  };
                  return returnObj;
                }
              }
            }
          }
      }
    }
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

function generateOtp() {
  var otp = '';
  var possible = '0123456789';
  for (var i = 0; i <= 5; i++) {
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return otp;
}
var PaymentPlan = {
  'outOfPocket': 'wallet',
  'insurance': 'insurance',
  'company': 'company',
  'family': 'family',
  'waved': 'waved',
};
module.exports = function (options) {
  return new Service(options);
};

async function onDebitWallet(data, description, ref, facilitiesService, peopleService, paymentPlan) {
  console.log("Inside On Debit Wallet function");
  console.log(data.inputedValue.paymentMethod.planType);
  console.log(paymentPlan.outOfPocket);
  if (data.inputedValue.paymentMethod.planType == paymentPlan.company || data.inputedValue.paymentMethod.planType == paymentPlan.insurance) {
    console.log('A');
    const facility = facilitiesService.get(data.inputedValue.paymentMethod._id, {});
    console.log('B');
    let currentBalance = parseInt(facility.wallet.balance) - parseInt(data.inputedValue.amountPaid);
    console.log('C');
    facility.wallet.balance = currentBalance;
    console.log('D');
    facility.wallet.ledgerBalance = currentBalance;
    console.log('E');
    facility.wallet.transactions.push({
      'transactionType': data.inputedValue.transactionType,
      'amount': data.inputedValue.amountPaid,
      'refCode': ref,
      'description': description,
      'transactionMedium': data.inputedValue.paymentMethod.planType,
      'transactionStatus': data.transactionStatus,
      'balance': currentBalance,
      'ledgerBalance': currentBalance
    });
    console.log('F');
    const patchedFacility = facilitiesService.patch(facility._id, {
      wallet: facility.wallet
    });
    console.log('G');
    if (data.inputedValue.balance == 0) {
      console.log('H');
      patchedFacility.isPaid = true;
      patchedFacility.isWaved = false;
      patchedFacility.paidStatus = 'PAID';
      console.log('I');
    } else {
      console.log('J');
      patchedFacility.paidStatus = 'UNPAID';
      patchedFacility.isPaid = false;
      console.log('K');
    }

    let returnObj = {
      facility: patchedFacility,
      invoice: data.currentInvoice
    };
    console.log('L');
    return returnObj;
  } else if (data.inputedValue.paymentMethod.planType == paymentPlan.outOfPocket || data.inputedValue.paymentMethod.planType == paymentPlan.family) {
    console.log('A');
    console.log(data.inputedValue);
    const getPerson = await peopleService.get(data.inputedValue.paymentMethod.bearerPersonId, {});
    console.log('B');
    let currentBalance = parseInt(getPerson.wallet.balance) - parseInt(data.inputedValue.amountPaid);
    console.log('C');
    getPerson.wallet.balance = currentBalance;
    console.log('D');
    getPerson.wallet.ledgerBalance = currentBalance;
    console.log('E');
    getPerson.wallet.transactions.push({
      'transactionType': data.inputedValue.transactionType,
      'amount': data.inputedValue.amountPaid,
      'refCode': ref,
      'transactionMedium': data.inputedValue.paymentMethod.planType,
      'description': description,
      'transactionStatus': data.transactionStatus,
      'balance': currentBalance,
      'ledgerBalance': currentBalance
    });
    console.log('F');
    const patchedPerson = await peopleService.patch(getPerson._id, {
      wallet: getPerson.wallet
    });
    console.log('G');
    if (data.inputedValue.balance == 0) {
      patchedPerson.isPaid = true;
      patchedPerson.paidStatus = 'PAID';
      patchedPerson.isWaved = false;
      console.log('H');
    } else {
      patchedPerson.isPaid = false;
      patchedPerson.paidStatus = 'UNPAID';
      console.log('I');
    }
    let returnObj = {
      person: patchedPerson,
      invoice: data.currentInvoice
    };
    console.log(returnObj);
    console.log('J');
    return returnObj;
  }
}

module.exports.Service = Service;
