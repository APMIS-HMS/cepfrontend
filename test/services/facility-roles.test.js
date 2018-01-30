const assert = require('assert');
const app = require('../../src/app');

describe('\'facility-roles\' service', () => {
  it('registered the service', () => {
    const service = app.service('facility-roles');

    assert.ok(service, 'Registered the service');
  });
});
