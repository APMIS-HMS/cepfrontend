const assert = require('assert');
const app = require('../../src/app');

describe('\'assign-employee-unit\' service', () => {
  it('registered the service', () => {
    const service = app.service('assign-employee-unit');

    assert.ok(service, 'Registered the service');
  });
});
