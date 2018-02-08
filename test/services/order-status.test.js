const assert = require('assert');
const app = require('../../src/app');

describe('\'order-status\' service', () => {
  it('registered the service', () => {
    const service = app.service('order-status');

    assert.ok(service, 'Registered the service');
  });
});
