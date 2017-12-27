const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-types');

    assert.ok(service, 'Registered the service');
  });
});
