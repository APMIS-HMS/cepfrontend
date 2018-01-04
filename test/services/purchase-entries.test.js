const assert = require('assert');
const app = require('../../src/app');

describe('\'purchaseEntries\' service', () => {
  it('registered the service', () => {
    const service = app.service('purchase-entries');

    assert.ok(service, 'Registered the service');
  });
});
