/* eslint-disable no-unused-vars */
const logger = require('winston');
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
    const invoicesService = this.app.service('invoices');
    var moneyBasedLoc = [];
    return new Promise(function (resolve, reject) {
      invoicesService.find({
          query: {
            facilityId: id,
            $limit: false
          }
        })
        .then(payload => {
          let len = payload.data.length - 1;
          for (let i = len; i >= 0; i--) {
            if (payload.data[i].balance < payload.data[i].totalPrice) {
              let len2 = payload.data[i].billingIds.length - 1;
              var amountPaid = payload.data[i].totalPrice - payload.data[i].balance;
              for (let j = len2; j >= 0; j--) {
                if (payload.data[i].billingIds[j].billObject != undefined) {
                  let amtPerItem = 0;
                  if (amountPaid > payload.data[i].billingIds[j].billObject.totalPrice) {
                    amtPerItem = payload.data[i].billingIds[j].billObject.totalPrice;
                    amountPaid -= amtPerItem;
                  } else if (amountPaid == payload.data[i].billingIds[j].billObject.totalPrice) {
                    amtPerItem = payload.data[i].billingIds[j].billObject.totalPrice;
                    amountPaid -= amtPerItem;
                  } else {
                    amtPerItem = amountPaid;
                    amountPaid = 0;
                  }
                  moneyBasedLoc.push({
                    "location": payload.data[i].billingIds[j].billObject.facilityServiceObject,
                    "createdAt": dateFormater(payload.data[i].billingIds[j].billObject.createdAt),
                    "totalPrice": amtPerItem
                  })
                }
              }
            }
          }
          var dates = [];
          var amounts_with_label = [];
          var counter = 0;
          var filteredMoneyBasedLoc = [];
          let len3 = moneyBasedLoc.length - 1;
          for (let i = len3; i >= 0; i--) {
            var index = amounts_with_label.filter(x => x.label.toString() == moneyBasedLoc[i].location.category.toString());
            if (index.length > 0) {
              index[0].data.push(moneyBasedLoc[i].totalPrice);
              index[0].label = moneyBasedLoc[i].location.category;
              dates.push(moneyBasedLoc[i].createdAt);
            } else {
              dates.push(moneyBasedLoc[i].createdAt);
              var data = [];
              data.push(moneyBasedLoc[i].totalPrice);
              var label = moneyBasedLoc[i].location.category;
              amounts_with_label.push({
                "data": data,
                "label": label
              });
            }
            if (i == 0) {
              var result = {
                "barChartData": amounts_with_label,
                "barChartLabels": dates
              };
              resolve(result);
            }
          }
        }, error => {
          reject(error);
        });
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
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

function dateFormater(d) {
  var dt = new Date(d.toString())
  var dt2 = [dt.getDate(),
    dt.getMonth() + 1, dt.getFullYear()
  ].join('/');
  return dt2;
}

module.exports.Service = Service;
