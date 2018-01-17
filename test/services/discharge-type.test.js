const assert = require('assert');
const app = require('../../src/app');

describe('\'dischargeType\' service', () => {
  it('registered the service', () => {
    const service = app.service('discharge-types');

    assert.ok(service, 'Registered the service');
  });
});
