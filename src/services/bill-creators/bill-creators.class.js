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
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const patientsService = this.app.service('patients');
    const billingsService = this.app.service('billings');
    let billGroup = [];
    const insurance = data.filter(x => x.covered.coverType === "insurance");
    const wallet = data.filter(x => x.covered.coverType === "wallet");
    const company = data.filter(x => x.covered.coverType === "company");
    const family = data.filter(x => x.covered.coverType === "family");

    //Collection of insurance billitems
    let filteredInsurance = [];
    let len = insurance.length;
    console.log(insurance);
    for (let index = 0; index < len; index++) {
      if(filteredInsurance.length > 0){
        
      }
      const indx = filteredInsurance.filter(x => x.covered.hmoId.toString() === insurance[index].covered.hmoId.toString());
      const patient = await patientsService.get(params.query.patientId);
      const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.hmoId.toString() === insurance[index].covered.hmoId.toString());
      const billModel = {
        "facilityId": params.query.facilityId,
        "grandTotal": sumCost(indx),
        "patientId": patientPaymentType[0].planDetails.principalId,
        "subTotal": sumCost(indx),
        "billItems": indx
      }
      billGroup.push(billModel);
    }
    //Collection of Company Billitems
    let filteredCompany = [];
    len = company.length;
    for (let index = 0; index < len; index++) {
      const indx = filteredCompany.filter(x => x.covered.companyId.toString() === company[index].covered.companyId.toString());
      const patient = await patientsService.get(params.query.patientId);
      const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.companyId.toString() === company[index].covered.companyId.toString());
      const billModel = {
        "facilityId": params.query.facilityId,
        "grandTotal": sumCost(indx),
        "patientId": patientPaymentType[0].planDetails.principalId,
        "subTotal": sumCost(indx),
        "billItems": indx
      }
      billGroup.push(billModel);
    }

    //Collection of Family BillItems
    let filteredFamily = [];
    len = family.length;
    for (let index = 0; index < len; index++) {
      const indx = filteredFamily.filter(x => x.covered.familyId.toString() === family[index].covered.familyId.toString());
      const patient = await patientsService.get(params.query.patientId);
      const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.familyId.toString() === family[index].covered.familyId.toString());
      const billModel = {
        "facilityId": params.query.facilityId,
        "grandTotal": sumCost(indx),
        "patientId": patientPaymentType[0].planDetails.principalId,
        "subTotal": sumCost(indx),
        "billItems": indx
      }
      billGroup.push(billModel);
    }

    //Collection of Wallet Billitems
    const billModel = {
      "facilityId": params.query.facilityId,
      "grandTotal": sumCost(wallet),
      "patientId": params.query.patientId,
      "subTotal": sumCost(wallet),
      "billItems": wallet
    }
    billGroup.push(billModel);
    const bills = await billings.create(billGroup);
    return bills;
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

function sumCost(billItems) {
  let totalCost = 0;
  billItems.forEach(element => {
    if (element.active) {
      totalCost += element.totalPrice;
    }
  });
  return totalCost;
}
module.exports.Service = Service;
