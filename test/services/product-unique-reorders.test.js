const assert = require('assert');
const app = require('../../src/app');

describe('\'product-unique-reorders\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-unique-reorders');

    assert.ok(service, 'Registered the service');
  });
});
