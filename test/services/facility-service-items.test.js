const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityServiceItems\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-service-items');

    assert.ok(service, 'Registered the service');
  });
});
