const assert = require('assert');
const app = require('../../src/app');

describe('\'formScopeLevels\' service', () => {
  it('registered the service', () => {
    const service = app.service('form-scope-levels');

    assert.ok(service, 'Registered the service');
  });
});
