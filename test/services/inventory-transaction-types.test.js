const assert = require('assert');
const app = require('../../src/app');

describe('\'inventoryTransactionTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-transaction-types');

    assert.ok(service, 'Registered the service');
  });
});
