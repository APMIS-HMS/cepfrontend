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

  create(data, params) {
    const ref = generateOtp();
    const billingsService = this.app.service('billings');
    const invoicesService = this.app.service('invoices');
    const facilitiesService = this.app.service('facilities');
    const getTokenService = this.app.service('get-tokens');
    const peopleService = this.app.service('people');
    var description = "";
    return new Promise(function (resolve, reject) {
      if (data.isInvoicePage == false) {
        getTokenService.get(tokenLabel.tokenType.invoiceNo, {}).then(tokenPayload => {
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
              itemb.billObject.updatedAt = new Date;
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
          billGroup.invoiceNo = tokenPayload.result;
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
                        billingsService.patch(bill._id, {
                          billItems: filterCheckedBills[x4].billItems
                        }).then(pd => {
                          if (x4 == len4) {
                            if (data.inputedValue.isWaved != true) {
                              data.invoice = payload;
                              onDebitWallet(data, resolve, description, ref, facilitiesService, peopleService,PaymentPlan);
                            } else {
                              pd.isPaid = false;
                              pd.isWaved = true;
                              var returnObj ={
                                bill : pd,
                                invoice:payload
                              };
                              resolve(returnObj);
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
            //console.log(error);
          });
        }
      });
      } else {
        console.log("A");
        if (data.inputedValue.balance == 0) {
          console.log("Into PAIN for TRUE")
          data.invoice.paymentCompleted = true;
          data.invoice.paymentStatus = "PAID";
        }
        console.log("B");
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
        console.log()
        invoicesService.patch(data.invoice._id, {
          billingIds: data.invoice.billingIds,
          balance: data.invoice.balance,
          payments: data.invoice.payments,
          paymentStatus: data.invoice.paymentStatus,
          paymentCompleted:data.invoice.paymentCompleted
        }).then(payload => {
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
                  if (n == 0) {
                    billingsService.patch(itemBill._id, {
                      billItems: itemBill.billItems
                    });
                  }
                  if (m == 0) {
                    if (data.inputedValue.isWaved != true) {
                      data.currentInvoice = payload;
                      onDebitWallet(data, resolve, description, ref, facilitiesService, peopleService,PaymentPlan);
                    } else {
                      itemBill.isPaid = false;
                      itemBill.isWaved = true;
                      itemBill.paidStatus = "WAIVED";
                      var returnObj ={
                        bill : itemBill,
                        invoice:payload
                      };
                      resolve(returnObj);
                    }
                  }
                }
              }
            });
          }
        }, error => {
          // console.log(error);
        });
      }
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

function generateOtp() {
  var otp = "";
  var possible = "0123456789";
  for (var i = 0; i <= 5; i++) {
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return otp;
};
var PaymentPlan = {
  'outOfPocket': 'wallet',
  'insurance': 'insurance',
  'company': 'company',
  'family': 'family',
  'waved': 'waved',
}
module.exports = function (options) {
  return new Service(options);
};

function onDebitWallet(data, resolve, description, ref, facilitiesService, peopleService, paymentPlan) {
  console.log(data.inputedValue.paymentMethod);
  if (data.inputedValue.paymentMethod.planType == paymentPlan.company || data.inputedValue.paymentMethod.planType == paymentPlan.insurance) {
    facilitiesService.get(data.inputedValue.paymentMethod._id, {})
      .then(facility => {
        var currentBalance = parseInt(facility.wallet.balance) - parseInt(data.inputedValue.amountPaid);
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
        facilitiesService.patch(facility._id, {
          wallet: facility.wallet
        }).then(payload2 => {
          if (data.inputedValue.balance == 0) {
            payload2.isPaid = true;
            payload2.isWaved = false;
            payload2.paidStatus = "PAID";
          } else {
            payload2.paidStatus = "UNPAID";
            payload2.isPaid = false;
          }
          
          var returnObj ={
            facility : payload2,
            invoice:data.currentInvoice
          };
          resolve(returnObj);
        })
      });
  } else if (data.inputedValue.paymentMethod.planType == paymentPlan.outOfPocket || data.inputedValue.paymentMethod.planType == paymentPlan.family) {
    peopleService.get(data.inputedValue.paymentMethod._id, {}).then(person => {
      var currentBalance = parseInt(person.wallet.balance) - parseInt(data.inputedValue.amountPaid);
      person.wallet.balance = currentBalance;
      person.wallet.ledgerBalance = currentBalance;
      person.wallet.transactions.push({
        "transactionType": data.inputedValue.transactionType,
        "amount": data.inputedValue.amountPaid,
        "refCode": ref,
        "transactionMedium": data.inputedValue.paymentMethod.planType,
        "description": description,
        "transactionStatus": data.transactionStatus,
        "balance": currentBalance,
        "ledgerBalance": currentBalance
      });
      peopleService.patch(person._id, {
        wallet: person.wallet
      }).then(payload2 => {
        if (data.inputedValue.balance == 0) {
          payload2.isPaid = true;
          payload2.paidStatus = "PAID";
          payload2.isWaved = false;
        } else {
          payload2.isPaid = false;
          payload2.paidStatus = "UNPAID";
        }
        var returnObj ={
          person : payload2,
          invoice:data.currentInvoice
        };
        resolve(returnObj);
      })
    });
  }
}

module.exports.Service = Service;
