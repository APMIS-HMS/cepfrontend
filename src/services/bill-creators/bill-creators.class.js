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
        const insurance = data.filter(x => x.covered.coverType === 'insurance');
        const wallet = data.filter(x => x.covered.coverType === 'wallet');
        const company = data.filter(x => x.covered.coverType === 'company');
        const family = data.filter(x => x.covered.coverType === 'family');

        //Collection of insurance billitems
        let filteredInsurance = [];
        let len = insurance.length;
        for (let index = 0; index < len; index++) {
            const indx = insurance.filter(x => x.covered.hmoId.toString() === insurance[index].covered.hmoId.toString() && x.isPicked === undefined);
            if (indx.length > 0) {
                indx.forEach(x => {
                    x.isPicked = true;
                });
                const patient = await patientsService.get(params.query.patientId);
                const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.hmoId.toString() === insurance[index].covered.hmoId.toString());
                const billModel = {
                    'facilityId': params.query.facilityId,
                    'grandTotal': sumCost(indx),
                    'patientId': patientPaymentType[0].planDetails.principalId,
                    'subTotal': sumCost(indx),
                    'discount': 0,
                    'billItems': indx
                };
                billGroup.push(billModel);
            }
        }
        //Collection of Company Billitems
        len = company.length;
        for (let index = 0; index < len; index++) {
            const indx = company.filter(x => x.covered.companyId.toString() === company[index].covered.companyId.toString() && x.isPicked === undefined);
            if (indx.length > 0) {
                indx.forEach(x => {
                    x.isPicked = true;
                });
                const patient = await patientsService.get(params.query.patientId);
                const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.companyId.toString() === company[index].covered.companyId.toString());
                const billModel = {
                    'facilityId': params.query.facilityId,
                    'grandTotal': sumCost(indx),
                    'patientId': patientPaymentType[0].planDetails.principalId,
                    'subTotal': sumCost(indx),
                    'discount': 0,
                    'billItems': indx
                };
                billGroup.push(billModel);
            }
        }

        //Collection of Family BillItems
        len = family.length;
        for (let index = 0; index < len; index++) {
            const indx = family.filter(x => x.covered.familyId.toString() === family[index].covered.familyId.toString() && x.isPicked === undefined);
            if (indx.length > 0) {
                indx.forEach(x => {
                    x.isPicked = true;
                });
                const patient = await patientsService.get(params.query.patientId);
                const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.familyId.toString() === family[index].covered.familyId.toString());
                const billModel = {
                    'facilityId': params.query.facilityId,
                    'grandTotal': sumCost(indx),
                    'patientId': patientPaymentType[0].planDetails.principalId,
                    'subTotal': sumCost(indx),
                    'discount': 0,
                    'billItems': indx
                };
                billGroup.push(billModel);
            }
        }

        //Collection of Wallet Billitems
        if (wallet.length > 0) {
            const billModel = {
                'facilityId': params.query.facilityId,
                'grandTotal': sumCost(wallet),
                'patientId': params.query.patientId,
                'subTotal': sumCost(wallet),
                'billItems': wallet
            };
            billGroup.push(billModel);
        }
        const bills = await billingsService.create(billGroup);
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
