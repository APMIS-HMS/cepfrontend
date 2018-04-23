const assert = require('assert');
const app = require('../../src/app');

describe('\'payment-chart-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-chart-data');

    assert.ok(service, 'Registered the service');
  });
});
