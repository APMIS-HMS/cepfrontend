const assert = require('assert');
const app = require('../../src/app');

describe('\'inpatientWaitingTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('inpatient-waiting-types');

    assert.ok(service, 'Registered the service');
  });
});
