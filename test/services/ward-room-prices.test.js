const assert = require('assert');
const app = require('../../src/app');

describe('\'ward-room-prices\' service', () => {
  it('registered the service', () => {
    const service = app.service('ward-room-prices');

    assert.ok(service, 'Registered the service');
  });
});
