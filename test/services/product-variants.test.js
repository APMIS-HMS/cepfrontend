const assert = require('assert');
const app = require('../../src/app');

describe('\'product-variant\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-variant');

    assert.ok(service, 'Registered the service');
  });
});
