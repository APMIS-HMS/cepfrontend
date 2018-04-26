const logger = require('winston');
var isSameDay = require('date-fns/is_same_day');
const jsend = require('jsend');

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
    const awaitInvoices = await invoicesService.find({
      query: {
        facilityId: id,
        $sort: {
          updatedAt: -1
        }
      }
    });
    let amountReceived = 0;
    let invoiceItems = [];
    invoiceItems = awaitInvoices.data;
    if (invoiceItems.length > 0) {
      let patientRecentInvoices = [];
      let len2 = invoiceItems.length - 1;
      for (let k = len2; k >= 0; k--) {
        const val = invoiceItems[k];
        var filters = patientRecentInvoices.filter(x => x.patientId.toString() === val.patientId.toString());
        if (filters.length > 0) {
          filters[0].subTotal += parseInt(val.subTotal.toString());
          if (val.balance != undefined) {
            filters[0].balance += parseInt(val.balance.toString());
          }
          filters[0].payments.concat(val.payments);
          filters[0].billingIds.concat(val.billingIds);
        } else {
          patientRecentInvoices.push(val);
        }
        let result = patientRecentInvoices.filter(x => x.balance > 0);
        return jsend.success(result);
      }
    } else {
      return jsend.success([]);
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
