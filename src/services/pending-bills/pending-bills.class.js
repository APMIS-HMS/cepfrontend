/* eslint-disable no-unused-vars */
const logger = require('winston');
var isSameDay = require('date-fns/is_same_day');
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    async find(params) {
        let patientIds = [];
        let patientBills = [];
        let awaitedBills = {};
        const billingsService = this.app.service('billings');
        if (params.query.name === undefined) {
            awaitedBills = await billingsService.find({
                query: {
                    patientId: { $in: params.query.patientIds },
                    'billItems.isBearerConfirmed': true,
                    $or: [{ 'billItems.covered.coverType': 'wallet' }, { 'billItems.covered.coverType': 'family' }],
                    $sort: {
                        updatedAt: -1
                    }
                }
            });
        }

        awaitedBills.data.forEach(element => {
            const index = patientIds.filter(x => x.id.toString() === element.patientId.toString());
            if (index.length === 0) {
                patientIds.push({
                    id: element.patientId
                });
            }
        });
        const counter = patientIds.length - 1;
        for (let i = 0; i <= counter; i++) {
            const awaitedBillItems = await billingsService.find({
                query: {
                    patientId: patientIds[i].id,
                    'billItems.isBearerConfirmed': true,
                    $or: [{
                            'billItems.covered.coverType': 'wallet'
                        },
                        {
                            'billItems.covered.coverType': 'family'
                        }
                    ],
                }
            });
            patientBills.push.apply(patientBills, awaitedBillItems.data);

        }

        const retVal = GetBillData(patientBills);
        const billItemArrays = retVal.data.map(x => x.billItems);
        const distinctBillItems = [].concat.apply([], billItemArrays);
        const facilityServiceIds = distinctBillItems.map(x => x.facilityServiceId);

        const awaitedServices = await this.app.service('organisation-services').find({
            query: {
                '_id': { $in: facilityServiceIds },
            }
        });
        distinctBillItems.forEach(bill => {
            bill.serviceObj = this.getService(awaitedServices, bill.serviceId);
        });

        var minimisedBills = distinctBillItems.map(function(elem) {
            return {
                serviceObj: elem.serviceObj,
                totalPrice: elem.totalPrice,
                unitPrice: elem.unitPrice,
                quantity: elem.quantity,
                createdAt: elem.createdAt,
                facilityId: elem.facilityId
            };
        });
        return jsend.success(minimisedBills);
    }

    getService(awaitedServices, serviceId) {
        let retVal = undefined;
        if (awaitedServices.data[0].categories !== undefined) {
            if (awaitedServices.data[0].categories.length > 0) {
                const len2 = awaitedServices.data[0].categories.length - 1;
                for (let index2 = 0; index2 <= len2; index2++) {
                    const val = awaitedServices.data[0].categories[index2].services.filter(x => x._id.toString() == serviceId);
                    if (val.length > 0) {
                        retVal = val[0];
                    }
                }
            }
        }
        return retVal;
    }


    async get(id, params) {
        let patientIds = [];
        let patientBills = [];
        let awaitedBills = {};
        const billingsService = this.app.service('billings');
        const patientService = this.app.service('patients');
        const patientIdsService = this.app.service('db-patientids');
        const peopleService = this.app.service('people');
        if (params.query.name === undefined) {
            awaitedBills = await billingsService.find({
                query: {
                    facilityId: id,
                    'billItems.isBearerConfirmed': true,
                    $or: [{
                            'billItems.covered.coverType': 'wallet'
                        },
                        {
                            'billItems.covered.coverType': 'family'
                        }
                    ],
                    $sort: {
                        updatedAt: -1
                    }
                }
            });
        } else {
            const awaitedPatientIdItems = await patientIdsService.find({
                query: {
                    facilityId: id,
                    searchQuery: params.query.name
                }
            });
            if (Array.isArray(awaitedPatientIdItems.data)) {

                const billsPromiseYetResolved = Promise.all(awaitedPatientIdItems.data.map(current => billingsService.find({
                    query: {
                        facilityId: id,
                        patientId: current.patientId,
                        'billItems.isBearerConfirmed': true,
                        $or: [{
                                'billItems.covered.coverType': 'wallet'
                            },
                            {
                                'billItems.covered.coverType': 'family'
                            }
                        ],
                        $sort: {
                            updatedAt: -1
                        }
                    }
                })));

                const _awaitedBills = await billsPromiseYetResolved;
                awaitedBills = _awaitedBills[0];
            }
        }

        awaitedBills.data.forEach(element => {
            const index = patientIds.filter(x => x.id.toString() === element.patientId.toString());
            if (index.length === 0) {
                patientIds.push({
                    id: element.patientId
                });
            }
        });
        const counter = patientIds.length - 1;
        for (let i = 0; i <= counter; i++) {
            const awaitedBillItems = await billingsService.find({
                query: {
                    patientId: patientIds[i].id,
                    facilityId: id,
                    'billItems.isBearerConfirmed': true,
                    $or: [{
                            'billItems.covered.coverType': 'wallet'
                        },
                        {
                            'billItems.covered.coverType': 'family'
                        }
                    ],
                }
            });
            patientBills.push.apply(patientBills, awaitedBillItems.data);
            // awaitedBillItems.data.forEach(item => {
            //   patientBills.push(item);
            // });

        }
        let uniquePatients = [];
        patientBills.forEach(item => {
            const indx = uniquePatients.filter(x => x.patientId.toString() === item.patientId.toString());
            if (indx.length > 0) {
                indx[0].billItems.push.apply(indx[0].billItems, item.billItems);
                // item.billItems.forEach(itm => {
                //   indx[0].billItems.push(itm);
                // });
            } else {
                uniquePatients.push(item);
            }
        });

        return GetBillData(uniquePatients);
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

module.exports = function(options) {
    return new Service(options);
};

function GetBillData(result) {
    if (result.length > 0) {
        let len = result.length - 1;
        for (let j = len; j >= 0; j--) {
            result[j].grandTotalExcludeInvoice = 0;
            let len2 = result[j].billItems.length - 1;
            for (let k = len2; k >= 0; k--) {
                if (result[j].billItems[k].isInvoiceGenerated === false && result[j].billItems[k].isBearerConfirmed === true) {
                    result[j].grandTotalExcludeInvoice += parseInt(result[j].billItems[k].totalPrice.toString());
                }
            }
        }
        let patientSumBills = result; //.filter(x => x.grandTotalExcludeInvoice > 0);
        return jsend.success(patientSumBills);
    } else {
        return jsend.success([]);
    }

}
module.exports.Service = Service;