const assert = require('assert');
const app = require('../../src/app');

describe('\'pendingBills\' service', () => {
  it('registered the service', () => {
    const service = app.service('pending-bills');

    assert.ok(service, 'Registered the service');
  });
});
