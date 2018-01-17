const assert = require('assert');
const app = require('../../src/app');

describe('\'corperateFacility\' service', () => {
  it('registered the service', () => {
    const service = app.service('corperate-facilities');

    assert.ok(service, 'Registered the service');
  });
});
