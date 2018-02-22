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
    const priceService = this.app.service('facility-prices');
    let getPriceDetails = await priceService.get(data.priceId);
    let modifier = {};
    modifier.tagId = data.tagId;
    modifier.modifierType = data.modifierType;
    modifier.modifierValue = data.modifierValue;
    getPriceDetails.modifiers.push(modifier);

    let updatePrice = await priceService.patch(getPriceDetails._id, getPriceDetails);
    return updatePrice;
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

module.exports.Service = Service;
