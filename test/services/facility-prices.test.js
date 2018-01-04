const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityPrices\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-prices');

    assert.ok(service, 'Registered the service');
  });
});
