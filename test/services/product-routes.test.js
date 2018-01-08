const assert = require('assert');
const app = require('../../src/app');

describe('\'product-routes\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-routes');

    assert.ok(service, 'Registered the service');
  });
});
