const assert = require('assert');
const app = require('../../src/app');

describe('\'join-network\' service', () => {
  it('registered the service', () => {
    const service = app.service('join-network');

    assert.ok(service, 'Registered the service');
  });
});
