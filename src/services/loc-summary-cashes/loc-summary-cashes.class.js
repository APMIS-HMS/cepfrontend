/* eslint-disable no-unused-vars */
const logger = require('winston');
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
        var moneyBasedLoc = [];
        var awaitInvoces = await invoicesService.find({ query: { facilityId: id, $limit: false } });
        if (awaitInvoces.data.length > 0) {
            let len = awaitInvoces.data.length - 1;
            for (let i = len; i >= 0; i--) {
                if (awaitInvoces.data[i].balance < awaitInvoces.data[i].totalPrice) {
                    let len2 = awaitInvoces.data[i].billingIds.length - 1;
                    var amountPaid = awaitInvoces.data[i].totalPrice - awaitInvoces.data[i].balance;
                    for (let j = len2; j >= 0; j--) {
                        if (awaitInvoces.data[i].billingIds[j].billObject != undefined) {
                            let amtPerItem = 0;
                            if (amountPaid > awaitInvoces.data[i].billingIds[j].billObject.totalPrice) {
                                amtPerItem = awaitInvoces.data[i].billingIds[j].billObject.totalPrice;
                                amountPaid -= amtPerItem;
                            } else if (amountPaid == awaitInvoces.data[i].billingIds[j].billObject.totalPrice) {
                                amtPerItem = awaitInvoces.data[i].billingIds[j].billObject.totalPrice;
                                amountPaid -= amtPerItem;
                            } else {
                                amtPerItem = amountPaid;
                                amountPaid = 0;
                            }
                            moneyBasedLoc.push({
                                'location': awaitInvoces.data[i].billingIds[j].billObject.facilityServiceObject,
                                'updatedAt': dateFormater(awaitInvoces.data[i].billingIds[j].billObject.updatedAt),
                                'totalPrice': amtPerItem
                            });
                        }
                    }
                }
            }
            var dates = [];
            var amounts_with_label = [];
            var counter = 0;
            var filteredMoneyBasedLoc = [];
            let len3 = moneyBasedLoc.length - 1;
            for (let i = len3; i >= 0; i--) {
                var index = amounts_with_label.filter(x => x.label.toString() == moneyBasedLoc[i].location.category.toString());
                if (index.length > 0) {
                    index[0].data.push(moneyBasedLoc[i].totalPrice);
                    index[0].label = moneyBasedLoc[i].location.category;
                    dates.push(moneyBasedLoc[i].updatedAt);
                } else {
                    dates.push(moneyBasedLoc[i].updatedAt);
                    var data = [];
                    data.push(moneyBasedLoc[i].totalPrice);
                    var label = moneyBasedLoc[i].location.category;
                    amounts_with_label.push({
                        'data': data,
                        'label': label
                    });
                }
                if (i == 0) {
                    var result = {
                        'barChartData': amounts_with_label,
                        'barChartLabels': dates
                    };
                    return result;
                }
            }
        } else {
            result = {};
            return result;
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

module.exports = function(options) {
    return new Service(options);
};

function dateFormater(d) {
    var dt = new Date(d.toString());
    var dt2 = [dt.getDate(),
        dt.getMonth() + 1, dt.getFullYear()
    ].join('/');
    return dt2;
}

module.exports.Service = Service;