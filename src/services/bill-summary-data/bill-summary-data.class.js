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
    const billingsService = this.app.service('billings');
    const invoicesService = this.app.service('invoices');
    let totalAmountUnpaidBills = 0;
    let totalAmountUnpaidInvoice = 0;
    let totalAmountPaidInvoice = 0;
    console.log(1);
    const bills = await billingsService.find({
      query: {
        facilityId: id
      }
    });
    console.log(2);
    for (let i = bills.data.length - 1; i >= 0; i--) {
      bills.data[i].billItems.filter(x => x.isInvoiceGenerated === false).forEach(element => {
        if (element.covered.coverType !== 'insurance' && element.covered.coverType !== 'company') {
          totalAmountUnpaidBills += element.totalPrice;
        }
      });
    }
    console.log(3);
    const invoicesAmountUnpaidInvoice = await invoicesService.find({
      query: {
        facilityId: id,
        paymentCompleted: false
      }
    });
    for (let i = invoicesAmountUnpaidInvoice.data.length - 1; i >= 0; i--) {
      totalAmountUnpaidInvoice += invoicesAmountUnpaidInvoice.data[i].balance;
    }
    console.log(6);
    const invoicesAmountPaidInvoice = await invoicesService.find({
      query: {
        facilityId: id
      }
    });
    console.log(7);
    for (let i = invoicesAmountPaidInvoice.data.length - 1; i >= 0; i--) {
      totalAmountPaidInvoice += (invoicesAmountPaidInvoice.data[i].totalPrice - invoicesAmountPaidInvoice.data[i].balance);
    }
    console.log(8);
    let returnValue = {
      PaidIvoices: totalAmountPaidInvoice,
      UnpaidInvoices: totalAmountUnpaidInvoice,
      UnpaidBills: totalAmountUnpaidBills
    }
    return jsend.success(returnValue);
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
