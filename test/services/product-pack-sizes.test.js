const assert = require('assert');
const app = require('../../src/app');

describe('\'product-pack-sizes\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-pack-sizes');

    assert.ok(service, 'Registered the service');
  });
});
