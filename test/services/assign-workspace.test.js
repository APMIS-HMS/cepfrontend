const assert = require('assert');
const app = require('../../src/app');

describe('\'assign-workspace\' service', () => {
  it('registered the service', () => {
    const service = app.service('assign-workspace');

    assert.ok(service, 'Registered the service');
  });
});
