const assert = require('assert');
const app = require('../../src/app');

describe('\'todayInvoices\' service', () => {
  it('registered the service', () => {
    const service = app.service('today-invoices');

    assert.ok(service, 'Registered the service');
  });
});
