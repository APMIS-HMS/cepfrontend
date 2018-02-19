/* eslint-disable no-unused-vars */
var difference_in_calendar_days = require('date-fns/difference_in_calendar_days');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const inventoriesService = this.app.service('inventories');
    const productService = this.app.service('list-of-products');
    let products = await productService.find({
      query: {
        name: params.query.name
      }
    });
    let inventories = await inventoriesService.find({
      query: {
        facilityId: params.query.facilityId,
        storeId: params.query.storeId
      }
    });
    if (products.data.length > 0 && inventories.data.length > 0) {
      let len = products.data.length - 1;
      for (let index = len; index >= 0; index--) {
        let len2 = inventories.data.length - 1;
        for (let index2 = len2; index2 >= 0; index2--) {
          if (inventories.data[index2].productId.toString() === products.data[index]._id.toString()) {
            inventories.data[index2].productObject = products.data[index];
            if (inventories.data[index2].transactions.length > 0) {
              let len3 = inventories.data[index2].transactions.length - 1;
              for (let index3 = len3; index3 >= 0; index3--) {
                if (inventories.data[index2].transactions[index3].expiryDate != undefined) {
                  inventories.data[index2].transactions[index3].expiration = expiration(inventories.data[index2].transactions[index3].expiryDate, new Date());
                }
                if (inventories.data[index2].transactions[index3].availableQuantity <= 0) {
                  inventories.data[index2].transactions.splice(index3, 1);
                }
              }
            }
          }
        }
      }
      return inventories;
    } else {
      let result = {
        data: []
      };
      return result;
    }
  }

  async get(id, params) {

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

function expiration(date1, date2) {
  let days = difference_in_calendar_days(date1, date2);
  let dateRemains = '';
  let rem = days % 365;
  if (rem > 0) {
    let rationalNo = days - rem;
    let year = rationalNo / 365;
    if (year >= 2) {
      dateRemains = year + ' Years ';
    } else if (year == 1) {
      dateRemains = year + ' Year ';
    }
    let mRem = rem % 31;
    if (mRem > 0) {
      let nRational = rem - mRem;
      let m = nRational / 31;
      if (m >= 2) {
        dateRemains += m + ' Months ';
      } else if (m == 1) {
        dateRemains += m + ' Month ';
      }
      if (mRem >= 2) {
        dateRemains += mRem + ' Days ';
      } else if (mRem == 1) {
        dateRemains += mRem + ' Day ';
      }
    } else {
      mRem = rem / 31;
      if (mRem >= 2) {
        dateRemains += mRem + ' Months ';
      } else if (mRem == 1) {
        dateRemains += mRem + ' Month ';
      }
    }
  } else {
    rem = days / 365;
    if (rem >= 2) {
      dateRemains = rem + ' Years ';
    } else if (rem == 1) {
      dateRemains = rem + ' Year ';
    }
  }
  return dateRemains;
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
