// Use this context to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    if (context.type == "after") {
      const queryBillItem = context.params.isinvoice;
      if (queryBillItem == "true") {
        promises.push(context.app.service('invoices').find({
          query: {
            facilityId: context.params.query.facilityId,
            patientId: context.params.query.patientId
          }
        }).then(invoiceItems => {
          if (invoiceItems.data.length != 0) {
            context.result.data.filter(function (e) {
              invoiceItems.data.filter(function (item) {
                e.billItems = e.billItems.filter(el => item.billingIds.indexOf(el._id) === -1)
              });
            })
          }
        }))
      }

    } else {
      if (context.params.query != undefined && context.params.query.isinvoice != undefined) {
        context.params.isinvoice = context.params.query.isinvoice;
        delete context.params.query.isinvoice
      }
    }
    return Promise.resolve(context);
  };
};
