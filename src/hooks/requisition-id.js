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
    var retVal = "RQ" + number + "" + randamApha();
    return retVal;
}

async function generateUniqueOrderNumber(v) {
    const storeRequisition = v.app.service('store-requisitions');
    let orderNo = OrderId();
    const storeRequisitionReturn = await storeRequisition.find({query: { facilityId: v.data.facilityId, storeRequisitionNumber: orderNo }});
    if (storeRequisitionReturn.data.length == 0) {
        v.data.storeRequisitionNumber = orderNo;
    } else {
        return generateUniqueOrderNumber(v);
    }

};


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    return generateUniqueOrderNumber(context);
  };
};
