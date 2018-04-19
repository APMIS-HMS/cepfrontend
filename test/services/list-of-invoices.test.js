const assert = require('assert');
const app = require('../../src/app');

describe('\'list-of-invoices\' service', () => {
  it('registered the service', () => {
    const service = app.service('list-of-invoices');

    assert.ok(service, 'Registered the service');
  });
});
