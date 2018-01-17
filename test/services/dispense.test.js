const assert = require('assert');
const app = require('../../src/app');

describe('\'dispense\' service', () => {
  it('registered the service', () => {
    const service = app.service('dispenses');

    assert.ok(service, 'Registered the service');
  });
});
