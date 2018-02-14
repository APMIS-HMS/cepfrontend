// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html


function randamApha() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 2; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function OrderId() {
    var number = Math.floor(Math.random() * 9999999) + 1;
    if (number.length < 7) {
        number = String("0000000" + number).slice(-7);
    }
    var retVal = "PO" + number + "" + randamApha();
    return retVal;
}

function generateUniqueOrderNumber(v) {
    const purchaseOrder = v.app.service('purchase-orders');
    let orderNo = OrderId();
    return purchaseOrder.find({
        query: { facilityId: v.data.facilityId, purchaseOrderNumber: orderNo }
    }).then(purchaseOrderReturn => {
        if (purchaseOrderReturn.data.length == 0) {
            v.data.purchaseOrderNumber = orderNo;
        } else {
            return generateUniqueOrderNumber(v);
        }
    });

};


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    return generateUniqueOrderNumber(context);
  };
};
