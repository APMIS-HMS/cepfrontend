const assert = require('assert');
const app = require('../../src/app');

describe('\'facilityServiceRender\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-service-rendered');

    assert.ok(service, 'Registered the service');
  });
});
