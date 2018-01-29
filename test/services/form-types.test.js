const assert = require('assert');
const app = require('../../src/app');

describe('\'formTypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('form-types');

    assert.ok(service, 'Registered the service');
  });
});
