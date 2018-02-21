const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory-transfer-statuses\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory-transfer-statuses');

    assert.ok(service, 'Registered the service');
  });
});
