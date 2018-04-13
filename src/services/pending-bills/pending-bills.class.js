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

    async get(id, params) {
        const billingsService = this.app.service('billings');
        const patientService = this.app.service('patients');
        const peopleService = this.app.service('people');
        const awaitedBills = await billingsService.find({
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
                },
                $limit: false
            }
        });
        let awaitedBillData = awaitedBills.data;
        const patientIdList = [];
        awaitedBillData.forEach(record => {
            patientIdList.push(record.patientId);
        });
        let awaitedPatientList = await patientService.find({
            query: {
                _id: { $in: patientIdList },
                $limit: false
            }
        });

        let bill = {};
        let billings = [];
        if (params.query.isQuery == true) {
            const len = awaitedBills.data.length - 1;
            for (let i = len; i >= 0; i--) {
                let awaitedPatient = awaitedPatientList.filter(x => x._id === awaitedBills.data[i].patientId)[0]; //await patientService.get(awaitedBills.data[i].patientId, {});
                let awaitPerson = awaitedPatient.personDetails; //await peopleService.get(awaitedPatient.personId, {});
                if (awaitPerson.firstName.toLowerCase().includes(params.query.name.toLowerCase()) ||
                    awaitPerson.lastName.toLowerCase().includes(params.query.name.toLowerCase())) {
                    billings.push(awaitedBills.data[i]);
                }
            }
        } else {
            billings = awaitedBills.data;
        }
        let result = [];
        let totalAmountBilled = 0;
        if (billings.length > 0) {
            for (let i = billings.length - 1; i >= 0; i--) {
                const val = billings[i];
                result.push(val);
            }
            // return GetBillData(result, totalAmountBilled, bill);
        }
        return GetBillData(result, totalAmountBilled, bill);
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

function GetBillData(result, totalAmountBilled, bill) {
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
            }
        }
        var patientSumBills = result.filter(x => x.grandTotalExcludeInvoice > 0);
        bill = {
            'bills': patientSumBills,
            'amountBilled': totalAmountBilled
        };
        return bill;
    } else {
        bill = {
            'bills': [],
            'amountBilled': totalAmountBilled
        };
        return bill;
    }

}
module.exports.Service = Service;