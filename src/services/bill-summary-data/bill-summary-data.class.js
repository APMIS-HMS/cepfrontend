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
        const bills = await billingsService.find({
            query: {
                facilityId: id
            }
        });
        for (let i = bills.data.length - 1; i >= 0; i--) {
            bills.data[i].billItems.filter(x => x.isInvoiceGenerated === false).forEach(element => {
                totalAmountUnpaidBills += element.totalPrice;
            });
        }
        const invoices = await invoicesService.find({
            query: {
                facilityId: id,
                paymentCompleted: false
            }
        });
        for (let i = invoices.data.length - 1; i >= 0; i--) {
            totalAmountUnpaidInvoice += invoices.data[i].balance;
        }

        const invoices2 = await invoicesService.find({
            query: {
                facilityId: id,
                paymentCompleted: false
            }
        });
        for (let i = invoices.data.length - 1; i >= 0; i--) {
            totalAmountUnpaidInvoice += invoices.data[i].balance;
        }

        const invoices3 = await invoicesService.find({
            query: {
                facilityId: id
            }
        });
        for (let i = invoices.data.length - 1; i >= 0; i--) {
            totalAmountPaidInvoice += (invoices.data[i].totalPrice - invoices.data[i].balance);
        }

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

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;