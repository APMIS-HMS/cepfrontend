const assert = require('assert');
const app = require('../../src/app');

describe('\'locSummaryCashes\' service', () => {
  it('registered the service', () => {
    const service = app.service('loc-summary-cashes');

    assert.ok(service, 'Registered the service');
  });
});
