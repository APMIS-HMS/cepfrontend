const assert = require('assert');
const app = require('../../src/app');

describe('\'crud-immunization-service\' service', () => {
  it('registered the service', () => {
    const service = app.service('crud-immunization-service');

    assert.ok(service, 'Registered the service');
  });
});
