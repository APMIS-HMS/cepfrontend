const assert = require('assert');
const app = require('../../src/app');

describe('\'customFacilityModules\' service', () => {
  it('registered the service', () => {
    const service = app.service('custom-facility-modules');

    assert.ok(service, 'Registered the service');
  });
});
