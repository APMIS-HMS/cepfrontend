const assert = require('assert');
const app = require('../../src/app');

describe('\'price-modifiers\' service', () => {
  it('registered the service', () => {
    const service = app.service('price-modifiers');

    assert.ok(service, 'Registered the service');
  });
});
