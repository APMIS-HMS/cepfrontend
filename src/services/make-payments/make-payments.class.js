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
      billGroup.facilityId = data.selectedFacility._id;
      billGroup.patientId = data.selectedPatient._id;
      data.billGroups.forEach((itemg, g) => {
        itemg.bills.forEach((itemb, b) => {
          if (itemb.isChecked) {
            if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
              itemb.billObject.isServiceEnjoyed = true;
            }
            if (data.inputedValue.balance == 0) {
              itemb.billObject.paymentCompleted = true;
            }
            itemb.billObject.isServiceEnjoyed = true;
            itemb.billObject.isInvoiceGenerated = true;
            itemb.billObject.updatedAt = new Date;
            description += itemb.billObject.facilityServiceObject.category + '-' + itemb.billObject.facilityServiceObject.service;
            billGroup.billingIds.push({
              billingId: itemb._id,
              billObject: itemb.billObject,
              billModelId: itemb.billModelId
            });
          }
        });
      });

      if (billGroup.billingIds.length > 0) {
        billGroup.payments = [];
        billGroup.totalDiscount = data.discount;
        billGroup.subTotal = data.subTotal;
        billGroup.totalPrice = data.inputedValue.cost;
        billGroup.balance = data.inputedValue.balance;
        billGroup.invoiceNo = tokenPayload.result;
        data.inputedValue.paymentMethod.reason = data.reason;
        billGroup.payments.push({
          'amountPaid': data.inputedValue.amountPaid,
          'description': description,
          'paymentMethod': data.inputedValue.paymentMethod,
          'balance': data.inputedValue.balance,
          'createdAt': new Date
        });
        if (data.inputedValue.balance == 0) {
          billGroup.paymentStatus = 'PAID';
          billGroup.paymentCompleted = true;
        }
        if (data.inputedValue.isWaved == true) {
          if (data.invoice === undefined) {
            data.invoice = {};
          }
          data.invoice.paymentStatus = 'WAIVED';
        }
        const awaitBillGroup = await invoicesService.create(billGroup);
        const len = data.checkBillitems.length - 1;
        const len2 = data.listedBillItems.length - 1;
        let filterCheckedBills = [];
        for (var x = len; x >= 0; x--) {
          for (var x2 = len2; x2 >= 0; x2--) {
            let len3 = data.listedBillItems[x2].billItems.length - 1;
            for (var x3 = len3; x3 >= 0; x3--) {
              if (data.listedBillItems[x2].billItems[x3]._id == data.checkBillitems[x]) {
                data.listedBillItems[x2].billItems[x3].isInvoiceGenerated = true;
                if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
                  data.listedBillItems[x2].billItems[x3].isServiceEnjoyed = true;
                }
                if (data.inputedValue.balance == 0) {
                  data.listedBillItems[x2].billItems[x3].paymentCompleted = true;
                }
                data.listedBillItems[x2].billItems[x3].isServiceEnjoyed = true;
                filterCheckedBills.push(data.listedBillItems[x2]);
                if (x == 0) {
                  let len4 = filterCheckedBills.length;
                  let pds = [];
                  for (let _indx = 0; _indx < len4; _indx++) {
                    const pd = await billingsService.patch(filterCheckedBills[_indx]._id, {
                      billItems: filterCheckedBills[_indx].billItems
                    });
                    pds.push(pd);
                  }
                  if (data.inputedValue.isWaved != true) {
                    data.invoice = awaitBillGroup;
                    return onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan);
                  } else {
                    let pd = {};
                    pd.isPaid = false;
                    pd.isWaved = true;
                    pds.push(pd);
                    let returnObj = {
                      bill: pds,
                      invoice: awaitBillGroup
                    };
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
      const patechedInvoice = await invoicesService.patch(data.invoice._id, {
        billingIds: data.invoice.billingIds,
        balance: data.invoice.balance,
        payments: data.invoice.payments,
        paymentStatus: data.invoice.paymentStatus,
        paymentCompleted: data.invoice.paymentCompleted
      });
      let len5 = patechedInvoice.billingIds.length - 1;
      for (let m = len5; m >= 0; m--) {
        const itemBill = await billingsService.get(patechedInvoice.billingIds[m].billModelId, {});
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
                return onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan);
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
  if (data.inputedValue.paymentMethod.planType == paymentPlan.company || data.inputedValue.paymentMethod.planType == paymentPlan.insurance) {
    let facility = {};
    if (data.inputedValue.paymentMethod.facilityId !== undefined) {
      facility = await facilitiesService.get(data.inputedValue.paymentMethod.facilityId, {});
    } else {
      facility = await peopleService.get(data.selectedPatient.personDetails._id, {});
    }
    let currentBalance = parseInt(facility.wallet.balance) - parseInt(data.inputedValue.amountPaid);
    facility.wallet.balance = currentBalance;
    facility.wallet.ledgerBalance = currentBalance;
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
    const patchedFacility = facilitiesService.patch(facility._id, {
      wallet: facility.wallet
    });
    if (data.inputedValue.balance == 0) {
      patchedFacility.isPaid = true;
      patchedFacility.isWaved = false;
      patchedFacility.paidStatus = 'PAID';
    } else {
      patchedFacility.paidStatus = 'UNPAID';
      patchedFacility.isPaid = false;
    }

    let returnObj = {
      facility: patchedFacility,
      invoice: data.currentInvoice
    };
    return returnObj;
  } else if (data.inputedValue.paymentMethod.planType == paymentPlan.outOfPocket || data.inputedValue.paymentMethod.planType == paymentPlan.family) {
    let getPerson = {};
    if (data.inputedValue.paymentMethod.bearerPersonId !== undefined) {
      getPerson = await peopleService.get(data.inputedValue.paymentMethod.bearerPersonId, {});
    } else {
      getPerson = await peopleService.get(data.selectedPatient.personDetails._id, {});
    }
    let currentBalance = parseInt(getPerson.wallet.balance) - parseInt(data.inputedValue.amountPaid);
    getPerson.wallet.balance = currentBalance;
    getPerson.wallet.ledgerBalance = currentBalance;
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
    const patchedPerson = await peopleService.patch(getPerson._id, {
      wallet: getPerson.wallet
    });
    if (data.inputedValue.balance == 0) {
      patchedPerson.isPaid = true;
      patchedPerson.paidStatus = 'PAID';
      patchedPerson.isWaved = false;
    } else {
      patchedPerson.isPaid = false;
      patchedPerson.paidStatus = 'UNPAID';
    }
    let returnObj = {
      person: patchedPerson,
      invoice: data.currentInvoice
    };
    return returnObj;
  }
}

module.exports.Service = Service;
