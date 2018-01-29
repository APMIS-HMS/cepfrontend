const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityAccessControl\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-access-control');

    assert.ok(service, 'Registered the service');
  });
});
