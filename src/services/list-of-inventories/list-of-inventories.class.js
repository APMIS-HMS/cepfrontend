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
    const fpService = this.app.service('formulary-products');
    let _inventories = {};
    _inventories.data = [];

    let productIds = await fpService.find({
      query: {
        name: params.query.name
      }
    });
    // console.log(productIds);
    for (let index = 0; index < productIds.data.length; index++) {
      const inventories = await inventoriesService.find({
        query: {
          facilityId: params.query.facilityId,
          storeId: params.query.storeId,
          productId: productIds.data[index].id
        }
      });
      if(inventories.data[0]!== undefined){
        _inventories.data.push(inventories.data[0]);
      }
    }
    // let inventoriesDefined = inventories.data.filter(x => x.productObject !== undefined);

    // const filter = inventoriesDefined.filter(x => x.productObject.name.includes(params.query.name));
    // console.log(filter)
    // _inventories.data = inventories.data; //filter;
    if (_inventories.data.length > 0) {
      for (let index2 = _inventories.data.length - 1; index2 >= 0; index2--) {
        if (_inventories.data[index2].transactions.length > 0) {
          let len3 = _inventories.data[index2].transactions.length - 1;
          for (let index3 = len3; index3 >= 0; index3--) {
            if (_inventories.data[index2].transactions[index3].expiryDate != undefined) {

              _inventories.data[index2].transactions[index3].expiration = expiration(_inventories.data[index2].transactions[index3].expiryDate, new Date());
            }
            if (_inventories.data[index2].transactions[index3].availableQuantity <= 0) {
              _inventories.data[index2].transactions.splice(index3, 1);
            }
          }
        }
      }
      return _inventories;
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
