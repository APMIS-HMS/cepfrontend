/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    const facilityId = params.query.facilityId;
    const searchName = params.query.supplierName.toLowerCase();
    const supplierService = this.app.service('suppliers');
    const suppliers = await supplierService.find({});
    let searchArray = [];
    let suppliersLength = suppliers.data.length;
    const suppliersObject = suppliers.data;
    while(suppliersLength--){
      let supName = suppliersObject[suppliersLength].supplier.name.toLowerCase();
      if(supName.indexOf(searchName) >= 0){
        searchArray.push(suppliersObject[suppliersLength]);
      }
    }
    return searchArray;
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  async create (data, params) {
    const supplierService = this.app.service('suppliers');
    const supplierId = data.supplierId;
    const facilityId = data.facilityId;
    const employeeId = data.createdBy;

    const supplier = await supplierService.find({
      query:{
        facilityId: facilityId,
        supplierId: supplierId
      }
    });

    if(supplier.data.length > 0){
      return jsend.error('Supplier already exist for this facility');
    }else{
      const createdSupplier = await supplierService.create(data);
      return jsend.success(createdSupplier);
    }

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
