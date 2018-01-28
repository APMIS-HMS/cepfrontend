/* eslint-disable no-unused-vars */
const logger = require('winston');
var isSameDay = require('date-fns/is_same_day');
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
    const billingsService = this.app.service('billings');
    const patientService = this.app.service('patients');
    const peopleService = this.app.service('people');
    return new Promise(function (resolve, reject) {
      billingsService.find({
        query: {
          facilityId: id,
          $sort: {
            updatedAt: -1
          },
          $limit: false
        }
      }).then(payload => {
        var bill = {};
        var billings = [];
        if (params.query.isQuery == true) {
          let len = payload.data.length - 1;
          for (let i = len; i >= 0; i--) {
            patientService.get(payload.data[i].patientId, {}).then(patient => {
              peopleService.get(patient.personId, {}).then(person => {
                if (person.firstName.toLowerCase().includes(params.query.name.toLowerCase()) ||
                  person.lastName.toLowerCase().includes(params.query.name.toLowerCase())) {
                  billings.push(payload.data[i]);

                }
              });
            });
          }
        } else {
          billings = payload.data;
          var result = [];
          var totalAmountBilled = 0;
          for (let i = billings.length - 1; i >= 0; i--) {
            const val = billings[i];
            patientService.get(val.patientId, {}).then(patient => {
              peopleService.get(patient.personId, {}).then(person => {
                val.personDetails = person;
                result.push(val);
                if (i == 0) {
                  GetBillData(resolve, result, totalAmountBilled, bill);
                }
              });
            });
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

function GetBillData(resolve, result, totalAmountBilled, bill) {
  if (result.length > 0) {
    var counter = 0;
    var today = new Date();
    let len = result.length - 1;
    var dt = new Date();
    for (let j = len; j >= 0; j--) {
      result[j].grandTotalExcludeInvoice = 0;
      let len2 = result[j].billItems.length - 1;
      for (let k = len2; k >= 0; k--) {
        if (j != 9) {
          if (isSameDay(result[j].billItems[k].updatedAt, dt)) {
            totalAmountBilled += parseInt(result[j].billItems[k].totalPrice.toString());
          }
          if (result[j].billItems[k].isInvoiceGenerated == false) {
            result[j].grandTotalExcludeInvoice += parseInt(result[j].billItems[k].totalPrice.toString());
          }
        } else {
          if (isSameDay(result[j].billItems[k].updatedAt, dt)) {
            totalAmountBilled += parseInt(result[j].billItems[k].totalPrice.toString());
          }
        }
        if (j == 0) {
          var patientSumBills = result.filter(x => x.grandTotalExcludeInvoice > 0);
          bill = {
            "bills": patientSumBills,
            "amountBilled": totalAmountBilled
          };
          resolve(bill);
        }
      }
    }
  } else {
    bill = {
      "bills": [],
      "amountBilled": totalAmountBilled
    };
    resolve(bill);
  }

}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
