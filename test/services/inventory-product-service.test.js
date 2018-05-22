const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-product-service\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-product-service');

    assert.ok(service, 'Registered the service');
  });
});
