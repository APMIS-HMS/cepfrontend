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

  async get(id, params) {
    const invoicesService = this.app.service('invoices');
    const patientService = this.app.service('patients');
    const peopleService = this.app.service('people');
    var awaitInvoices = await invoicesService.find({
      query: {
        facilityId: id,
        $sort: {
          updatedAt: -1
        },
        $limit: false
      }
    });
    var amountReceived = 0;
    var invoiceItems = [];
    var result = {
      "invoices": [],
      "amountReceived": 0
    };
    if (params.query.isQuery == true) {
      let len = awaitInvoices.data.length - 1;
      for (let i = len; i >= 0; i--) {
        var awaitPatient = await patientService.get(awaitInvoices.data[i].patientId, {});
        var awaitPerson = await peopleService.get(awaitPatient.personId, {});
        if (awaitPerson.firstName.toLowerCase().includes(params.query.name.toString()) || awaitPerson.lastName.toLowerCase().includes(params.query.name.toString())) {
          invoiceItems.push(awaitInvoices.data[i]);
        }
      }
    } else {
      invoiceItems = awaitInvoices.data;
      console.log(awaitInvoices.data.length);
    }
    var dt = new Date();
    var counter = 0;
    var patientRecentInvoices = [];
    let len2 = invoiceItems.length - 1;
    for (let k = len2; k >= 0; k--) {
      const val = invoiceItems[k];
      var awaitPatient = await patientService.get(val.patientId, {});
      var awaitPerson = await peopleService.get(awaitPatient.personId, {});
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
        val.personDetails = awaitPerson;
        patientRecentInvoices.push(val);
        if (isSameDay(val.updatedAt, dt)) {
          var amountPaid = val.totalPrice - val.balance;
          amountReceived += amountPaid;
        }
      }
      if (k == 0) {
        result.invoices = patientRecentInvoices.filter(x => x.balance > 0);
        result.amountReceived = amountReceived;
        return result;
      }
    }
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
