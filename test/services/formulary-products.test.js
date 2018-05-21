const assert = require('assert');
const app = require('../../src/app');

describe('\'formulary-products\' service', () => {
  it('registered the service', () => {
    const service = app.service('formulary-products');

    assert.ok(service, 'Registered the service');
  });
});
