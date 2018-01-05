const assert = require('assert');
const app = require('../../src/app');

describe('\'productvariant\' service', () => {
  it('registered the service', () => {
    const service = app.service('productvariant');

    assert.ok(service, 'Registered the service');
  });
});
