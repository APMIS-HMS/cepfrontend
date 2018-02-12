const assert = require('assert');
const app = require('../../src/app');

describe('\'stock-transfers\' service', () => {
  it('registered the service', () => {
    const service = app.service('stock-transfers');

    assert.ok(service, 'Registered the service');
  });
});
