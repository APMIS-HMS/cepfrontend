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
    var recentBillModelId = {};
    var masterBillGroups = {};
    var billGroups = {};
    const billingsService = this.app.service('billings');
    const facilityItemService = this.app.service('facility-service-items');
    var results = [];
    return new Promise(function (resolve, reject) {
      billingsService.find({
        query: {
          facilityId: params.query.facilityId,
          patientId: params.query.patientId,
          isinvoice: params.query.isinvoice
        }
      }).then(payload => {
        payload.data.forEach((element, i) => {
          facilityItemService.create(element, {}).then(payload2 => {
            console.log("AA" + payload2.billItems.length);
            results.push(payload2);
            if (i == payload.data.length - 1) {
              if (results.length > 0) {
                recentBillModelId = results[results.length - 1]._id;
              }
              masterBillGroups = [];
              billGroups = [];
              results.forEach((itemi, i) => {
                masterBillGroups.push(itemi);
                itemi.billItems.forEach((itemj, j) => {
                  if (itemj.isInvoiceGenerated === false || itemj.isInvoiceGenerated === undefined) {
                    fixedGroupExisting(itemj, itemi._id, billGroups, resolve, results);
                  }
                });
              });
            }
          }, error => {
            reject(error);
          });
        });
      }, error => {
        reject(error);
      });
    });
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data) {
    console.log("Am here");
    const billingsService = this.app.service('billings');
    const getTokenService = this.app.service('get-tokens');
    const invoicesService = this.app.service('invoices');
    var newBillItems = [];
    return new Promise(function (resolve, reject) {
      console.log("length " + data.checkBillitems.length);
      if (data.checkBillitems.length > 0) {
        const billGroup = {
          billingIds: []
        };
        billGroup.facilityId = data.facilityId;
        billGroup.patientId = data.patientId;
        data.billGroups.forEach((itemg, g) => {
          itemg.bills.forEach((itemb, b) => {
            if (itemb.isChecked) {
              itemb.billObject.isInvoiceGenerated = true;
              billGroup.billingIds
                .push({
                  billingId: itemb._id,
                  billObject: itemb.billObject,
                  billModelId: itemb.billModelId
                });
            }
          });
        });
        console.log(" billGroup.billingIds length " + billGroup.billingIds.length);
        getTokenService.get(tokenLabel.tokenType.invoiceNo, {}).then(tokenPayload => {
          console.log(tokenPayload);
          if (billGroup.billingIds.length > 0) {
            billGroup.totalDiscount = data.totalDiscount;
            billGroup.subTotal = data.subTotal;
            billGroup.totalPrice = data.totalPrice;
            billGroup.balance = data.totalPrice;
            billGroup.invoiceNo = tokenPayload.result;
            console.log(" billGroup.billingIds length " + billGroup.billingIds.length);
            invoicesService.create(billGroup).then(payload => {
              const len = data.checkBillitems.length - 1;
              const len2 = data.listedBillItems.length - 1;
              const filterCheckedBills = [];
              for (let x = len; x >= 0; x--) {
                for (let x2 = len2; x2 >= 0; x2--) {
                  const len3 = data.listedBillItems[x2].billItems.length - 1;
                  for (let x3 = len3; x3 >= 0; x3--) {
                    if (data.listedBillItems[x2].billItems[x3]._id == data.checkBillitems[x]) {
                      data.listedBillItems[x2].billItems[x3].isInvoiceGenerated = true;
                      data.listedBillItems[x2].billItems[x3].updatedAt = new Date;
                      filterCheckedBills.push(data.listedBillItems[x2]);
                      if (x == 0) {
                        const len4 = filterCheckedBills.length - 1;
                        for (let x4 = len4; x4 >= 0; x4--) {
                          billingsService.patch(filterCheckedBills[x4]._id, {
                            billItems: filterCheckedBills[x4].billItems
                          }).then(pd => {
                            if (x4 == 0) {
                              resolve(payload);
                            }
                          });
                        }
                      }
                    }
                  }
                }
              }
            }, error => {

              reject(error);
            });
          }
        });
      } else {
        var error = 'No bill selected';
        reject(error);
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

module.exports = function (options) {
  return new Service(options);
};

function fixedGroupExisting(bill, _id, billGroups, resolve, results) {
  var subTotal = 0;
  var total = 0;
  var discount = 0;
  const inBill = {};
  inBill.amount = bill.totalPrice;
  inBill.itemDesc = bill.description;
  inBill.itemName = bill.facilityServiceObject.service;
  inBill.qty = bill.quantity;
  inBill.covered = bill.covered;
  inBill.unitPrice = bill.unitPrice;
  inBill._id = bill._id;
  inBill.facilityServiceObject = bill.facilityServiceObject;
  inBill.billObject = bill;
  inBill.billModelId = _id

  const existingGroupList = billGroups.filter(x => x.categoryId === bill.facilityServiceObject.categoryId);
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
      subTotal = subTotal + existingGroup.total;
      total = subTotal - discount;
    } else {
      existingGroup.bills.push(inBill);
      subTotal = subTotal + existingGroup.total;
      total = subTotal - discount;
    }
    existingGroup.isOpened = false;
  } else {
    const group = {
      isChecked: false,
      total: 0,
      isOpened: false,
      categoryId: bill.facilityServiceObject.categoryId,
      category: bill.facilityServiceObject.category,
      bills: []
    };
    inBill.isChecked = false;
    group.bills.push(inBill);
    billGroups.push(group);
    billGroups.sort(p => p.categoryId);
    total = subTotal - discount;
    group.isOpened = true;
  }
  var _billGroups = {
    'originalCallback': results,
    'billGroups': billGroups,
    'total': total,
    'subTotal': subTotal,
    'discount': discount
  }
  resolve(_billGroups);
}
module.exports.Service = Service;
