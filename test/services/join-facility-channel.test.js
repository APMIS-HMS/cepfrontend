const assert = require('assert');
const app = require('../../src/app');

describe('\'join-facility-channel\' service', () => {
  it('registered the service', () => {
    const service = app.service('join-facility-channel');

    assert.ok(service, 'Registered the service');
  });
});
