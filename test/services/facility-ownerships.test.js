const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityOwnerships\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-ownerships');

    assert.ok(service, 'Registered the service');
  });
});
