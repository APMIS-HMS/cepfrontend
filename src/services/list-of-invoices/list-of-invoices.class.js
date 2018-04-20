const jsend = require('jsend');
/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const invoicesService = this.app.service('invoices');
    const patientIdsService = this.app.service('db-patientids');

    const awaitedPatientIdItems = await patientIdsService.find({
      query: {
        facilityId: params.query.facilityId,
        searchQuery: params.query.name
      }
    });
    if (Array.isArray(awaitedPatientIdItems.data) && awaitedPatientIdItems.data.length !== 0) {
      const invoicePromiseYetResolved = Promise.all(awaitedPatientIdItems.data.map(current =>  invoicesService.find({
        query: {
          facilityId: params.query.facilityId,
          patientId: current.patientId,
          $sort: {
            updatedAt: -1
          }
        }
      })));
      const _invoicePromiseYetResolved = await invoicePromiseYetResolved;
      return jsend.success(_invoicePromiseYetResolved[0].data);
    }else{
      const searchByInvoiceNo = await invoicesService.find({
        query: {
          facilityId: params.query.facilityId,
          invoiceNo:{
            $regex: params.query.name,
            '$options': 'i'
          },
          $sort: {
            updatedAt: -1
          }
        }
      });
      return jsend.success(searchByInvoiceNo.data);
    }
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
