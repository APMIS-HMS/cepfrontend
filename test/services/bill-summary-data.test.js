const assert = require('assert');
const app = require('../../src/app');

describe('\'bill-summary-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('bill-summary-data');

    assert.ok(service, 'Registered the service');
  });
});
