const assert = require('assert');
const app = require('../../src/app');

describe('\'billFacilityServices\' service', () => {
  it('registered the service', () => {
    const service = app.service('bill-facility-services');

    assert.ok(service, 'Registered the service');
  });
});
