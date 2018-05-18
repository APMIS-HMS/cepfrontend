const assert = require('assert');
const app = require('../../src/app');

describe('\'immunizationRecordHistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('immunization-record-history');

    assert.ok(service, 'Registered the service');
  });
});
