const assert = require('assert');
const app = require('../../src/app');

describe('\'product-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-types');

    assert.ok(service, 'Registered the service');
  });
});
