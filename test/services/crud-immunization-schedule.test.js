const assert = require('assert');
const app = require('../../src/app');

describe('\'crud-immunization-schedule\' service', () => {
  it('registered the service', () => {
    const service = app.service('crud-immunization-schedule');

    assert.ok(service, 'Registered the service');
  });
});
