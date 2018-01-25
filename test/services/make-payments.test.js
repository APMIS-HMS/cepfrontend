const assert = require('assert');
const app = require('../../src/app');

describe('\'makePayments\' service', () => {
  it('registered the service', () => {
    const service = app.service('make-payments');

    assert.ok(service, 'Registered the service');
  });
});
