const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityServices\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-services');

    assert.ok(service, 'Registered the service');
  });
});
