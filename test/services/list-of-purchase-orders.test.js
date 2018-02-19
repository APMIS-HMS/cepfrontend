const assert = require('assert');
const app = require('../../src/app');

describe('\'list-of-purchase-orders\' service', () => {
  it('registered the service', () => {
    const service = app.service('list-of-purchase-orders');

    assert.ok(service, 'Registered the service');
  });
});
