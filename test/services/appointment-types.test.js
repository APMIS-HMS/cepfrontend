const assert = require('assert');
const app = require('../../src/app');

describe('\'appointment-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('appointment-types');

    assert.ok(service, 'Registered the service');
  });
});
