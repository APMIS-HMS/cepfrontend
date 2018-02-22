const assert = require('assert');
const app = require('../../src/app');

describe('\'formscopelevels\' service', () => {
  it('registered the service', () => {
    const service = app.service('formscopelevels');

    assert.ok(service, 'Registered the service');
  });
});
