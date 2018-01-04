const assert = require('assert');
const app = require('../../src/app');

describe('\'vitaLocations\' service', () => {
  it('registered the service', () => {
    const service = app.service('vita-locations');

    assert.ok(service, 'Registered the service');
  });
});
