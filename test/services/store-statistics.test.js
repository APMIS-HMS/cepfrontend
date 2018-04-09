const assert = require('assert');
const app = require('../../src/app');

describe('\'store-statistics\' service', () => {
  it('registered the service', () => {
    const service = app.service('store-statistics');

    assert.ok(service, 'Registered the service');
  });
});
