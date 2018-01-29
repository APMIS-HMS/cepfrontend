const assert = require('assert');
const app = require('../../src/app');

describe('\'product-variants\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-variants');

    assert.ok(service, 'Registered the service');
  });
});
