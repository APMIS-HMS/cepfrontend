const assert = require('assert');
const app = require('../../src/app');

describe('\'inventoryTransfers\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-transfers');

    assert.ok(service, 'Registered the service');
  });
});
