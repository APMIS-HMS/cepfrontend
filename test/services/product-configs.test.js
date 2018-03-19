const assert = require('assert');
const app = require('../../src/app');

describe('\'product-configs\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-configs');

    assert.ok(service, 'Registered the service');
  });
});
