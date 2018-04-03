const assert = require('assert');
const app = require('../../src/app');

describe('\'product-reorder\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-reorders');

    assert.ok(service, 'Registered the service');
  });
});
