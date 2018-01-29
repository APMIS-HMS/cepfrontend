const logger = require('winston');
var isSameDay = require('date-fns/is_same_day');

/* eslint-disable no-unused-vars */
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
    const patientService = this.app.service('patients');
    const peopleService = this.app.service('people');
    return new Promise(function (resolve, reject) {
      invoicesService.find({
          query: {
            facilityId: id,
            $sort: {
              updatedAt: -1
            },
            $limit: false
          }
        })
        .then(payload => {
          var amountReceived = 0;
          var invoiceItems = [];
          var result = {
            "invoices": [],
            "amountReceived": 0
          };
          if (params.query.isQuery == true) {
            let len = payload.data.length - 1;
            for (let i = len; i >= 0; i--) {
              patientService.get(payload.data[i].patientId, {}).then(patient => {
                peopleService.get(patient.personId, {}).then(person => {
                  if (person.personDetails.personDetails.firstName.toLowerCase().includes(params.query.name) ||
                    person.personDetails.personDetails.lastName.toLowerCase().includes(params.query.name)) {
                    invoiceItems.push(payload.data[i]);
                  }
                });
              });
            }
          } else {
            invoiceItems = payload.data;
          }
          var dt = new Date();
          var counter = 0;
          var patientRecentInvoices = [];
          let len2 = invoiceItems.length - 1;
          for (let k = len2; k >= 0; k--) {
            const val = invoiceItems[k];
            // console.log(val.patientId);
            //if (val.paymentCompleted == false) {
            patientService.get(val.patientId, {}).then(patient => {
              peopleService.get(patient.personId, {}).then(person => {
                var filters = patientRecentInvoices.filter(x => x.patientId.toString() === val.patientId.toString());
                console.log(filters.length);
                if (filters.length > 0) {
                  filters[0].subTotal += parseInt(val.subTotal.toString());
                  console.log(filters[0].subTotal);
                  if (val.balance != undefined) {
                    filters[0].balance += parseInt(val.balance.toString());
                    console.log(filters[0].balance);
                  }
                  filters[0].payments.concat(val.payments);
                  filters[0].billingIds.concat(val.billingIds);
                  console.log("After concat");
                  if (isSameDay(val.updatedAt, dt)) {
                    var amountPaid = val.totalPrice - val.balance;
                    amountReceived += amountPaid;
                  }
                } else {
                  val.personDetails = person;
                  patientRecentInvoices.push(val);
                  if (isSameDay(val.updatedAt, dt)) {
                    var amountPaid = val.totalPrice - val.balance;
                    amountReceived += amountPaid;
                  }
                }
                if (k == 0) {
                  result.invoices = patientRecentInvoices;
                  result.amountReceived = amountReceived;
                  resolve(result);
                }
              }, error1 => {
                reject(error1);
              });
            }, error2 => {
              reject(error2);
            });
            
            //} else {
            //   if (isSameDay(val.updatedAt, dt)) {
            //     var amountPaid = val.totalPrice - val.balance;
            //     amountReceived += amountPaid;
            //   }
            // }

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

module.exports.Service = Service;
