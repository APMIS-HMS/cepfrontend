const assert = require('assert');
const app = require('../../src/app');

describe('\'ward-setup\' service', () => {
  it('registered the service', () => {
    const service = app.service('ward-setup');

    assert.ok(service, 'Registered the service');
  });
});
