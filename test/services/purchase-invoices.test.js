const assert = require('assert');
const app = require('../../src/app');

describe('\'purchase-invoices\' service', () => {
  it('registered the service', () => {
    const service = app.service('purchase-invoices');

    assert.ok(service, 'Registered the service');
  });
});
