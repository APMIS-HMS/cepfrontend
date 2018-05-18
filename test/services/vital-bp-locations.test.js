const assert = require('assert');
const app = require('../../src/app');

describe('\'vital-bp-locations\' service', () => {
  it('registered the service', () => {
    const service = app.service('vital-bp-locations');

    assert.ok(service, 'Registered the service');
  });
});
