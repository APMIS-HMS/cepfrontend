const assert = require('assert');
const app = require('../../src/app');

describe('\'searchNetworkFacilities\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-network-facilities');

    assert.ok(service, 'Registered the service');
  });
});
