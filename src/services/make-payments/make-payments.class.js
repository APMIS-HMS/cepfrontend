/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
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

  create(data, params) {
    const ref = generateOtp();
    return new Promise(function (resolve, reject) {
      onGenerateInvoice(data, resolve, ref);
    });
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
var PaymentPlan = {
  'outOfPocket': 'wallet',
  'insurance': 'insurance',
  'company': 'company',
  'family': 'family',
  'waved': 'waved',
};

function generateOtp() {
  var otp = "";
  var possible = "0123456789";
  for (var i = 0; i <= 5; i++) {
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return otp;
};

function onGenerateInvoice(data, resolve, ref) {
  const billingsService = this.app.service('billings');
  const invoicesService = this.app.service('invoices');
  var description = "";
  if (data.isInvoicePage == false) {
    var billGroup = {
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
          description += itemb.billObject.facilityServiceObject.category + "-" + itemb.billObject.facilityServiceObject.service;
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
      data.inputedValue.paymentMethod.reason = data.reason;
      billGroup.payments.push({
        "amountPaid": data.inputedValue.amountPaid,
        "description": description,
        "paymentMethod": data.inputedValue.paymentMethod,
        "balance": data.inputedValue.balance,
        "createdAt": new Date
      });
      if (data.inputedValue.balance == 0) {
        billGroup.paymentStatus = "PAID";
        billGroup.paymentCompleted = true;
      }
      if (data.inputedValue.isWaved == true) {
        data.invoice.paymentStatus = "WAIVED";
      }
      invoicesService.create(billGroup).then(payload => {
        var len = data.checkBillitems.length - 1;
        var len2 = data.listedBillItems.length - 1;
        var filterCheckedBills = [];
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
                  let len4 = filterCheckedBills.length - 1;
                  filterCheckedBills.forEach((bill, x4) => {
                    billingsService.update(bill._id, bill).then(pd => {
                      if (x4 == len4) {
                        if (data.inputedValue.isWaved != true) {
                          onDebitWallet(data, resolve, description, ref);
                        } else {
                          pd.isPaid = false;
                          pd.isWaved = true;
                          payload2.paidStatus = "WAIVED";
                          resolve(pd);
                        }
                      }
                    });
                  })
                }
              }
            }
          }
        }
      }, error => {
        console.log(error);
      });
    }
  } else {
    if (data.inputedValue.balance == 0) {
      data.invoice.paymentCompleted = true;
      data.invoice.paymentStatus = "PAID";
    }
    if (data.inputedValue.isWaved == true) {
      data.invoice.paymentStatus = "WAIVED";
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
      description += data.invoice.billingIds[v].billObject.facilityServiceObject.category + " - " + data.invoice.billingIds[v].billObject.facilityServiceObject.service;
    }

    data.invoice.balance = data.inputedValue.balance;
    data.inputedValue.paymentMethod.reason = data.reason;
    data.invoice.payments.push({
      "amountPaid": data.inputedValue.amountPaid,
      "paymentMethod": data.inputedValue.paymentMethod,
      "description": description,
      "balance": data.inputedValue.balance,
      "createdAt": new Date
    });
    invoicesService.update(data.invoice._id, data.invoice).then(payload => {
      let len5 = payload.billingIds.length - 1;
      for (let m = len5; m >= 0; m--) {
        billingsService.get(payload.billingIds[m].billModelId, {}).then(itemBill => {
          let len6 = itemBill.billItems.length - 1;
          for (let n = len6; n >= 0; n--) {
            if (itemBill.billItems[n]._id.toString() == payload.billingIds[m].billingId.toString()) {
              if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
                itemBill.billItems[n].isServiceEnjoyed = true;
              }
              if (data.inputedValue.balance == 0) {
                itemBill.billItems[n].paymentCompleted = true;
              }
              itemBill.billItems[n].isServiceEnjoyed = true;
              billingsService.update(itemBill._id, itemBill);
              if (m == 0) {
                if (data.inputedValue.isWaved != true) {
                  onDebitWallet(data, resolve, description, ref);
                } else {
                  itemBill.isPaid = false;
                  itemBill.isWaved = true;
                  itemBill.paidStatus = "WAIVED";
                  resolve(itemBill);
                }
              }
            }
          }
        });
      }
    }, error => {
      console.log(error);
    });
  }
}



function onDebitWallet(data, resolve, description, ref) {
  const facilitiesService = this.app.service('facilities');
  const peopleService = this.app.service('people');
  if (data.inputedValue.paymentMethod.planType == paymentPlan.company || data.inputedValue.paymentMethod.planType == paymentPlan.insurance) {
    facilitiesService.get(data.inputedValue.paymentMethod.planDetails._id, {})
      .then(facility => {
        var currentBalance = parseInt(facility.wallet.balance) - parseInt(data.inputedValue.cost);
        facility.wallet.balance = currentBalance;
        facility.wallet.ledgerBalance = currentBalance;
        facility.wallet.transactions.push({
          "transactionType": data.inputedValue.transactionType,
          "amount": data.inputedValue.amountPaid,
          "refCode": ref,
          "description": description,
          "transactionMedium": data.inputedValue.paymentMethod.planType,
          "transactionStatus": data.transactionStatus,
          "balance": currentBalance,
          "ledgerBalance": currentBalance
        });
        facilitiesService.update(facility._id, facility).then(payload2 => {
          if (data.inputedValue.balance == 0) {
            payload2.isPaid = true;
            payload2.isWaved = false;
            payload2.paidStatus = "PAID";
          } else {
            payload2.paidStatus = "UNPAID";
            payload2.isPaid = false;
          }
          resolve(payload2);
        })
      });
  } else if (data.inputedValue.paymentMethod.planType == paymentPlan.outOfPocket || data.inputedValue.paymentMethod.planType == paymentPlan.family) {
    peopleService.get(data.inputedValue.paymentMethod.planDetails._id, {}).then(person => {
      var currentBalance = parseInt(person.wallet.balance) - parseInt(data.inputedValue.cost);
      person.wallet.balance = currentBalance;
      person.wallet.ledgerBalance = currentBalance;
      person.wallet.transactions.push({
        "transactionType": data.inputedValue.transactionType,
        "amount": data.inputedValue.cost,
        "refCode": ref,
        "transactionMedium": data.inputedValue.paymentMethod.planType,
        "description": description,
        "transactionStatus": data.transactionStatus,
        "balance": currentBalance,
        "ledgerBalance": currentBalance
      });
      peopleService.update(person._id, person).then(payload2 => {
        if (data.inputedValue.balance == 0) {
          payload2.isPaid = true;
          payload2.paidStatus = "PAID";
          payload2.isWaved = false;
        } else {
          payload2.isPaid = false;
          payload2.paidStatus = "UNPAID";
        }
        resolve(payload2);
      })
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
