const assert = require('assert');
const app = require('../../src/app');

describe('\'addNetworks\' service', () => {
  it('registered the service', () => {
    const service = app.service('add-networks');

    assert.ok(service, 'Registered the service');
  });
});
