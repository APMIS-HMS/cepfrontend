const assert = require('assert');
const app = require('../../src/app');

describe('\'password-reset\' service', () => {
  it('registered the service', () => {
    const service = app.service('password-reset');

    assert.ok(service, 'Registered the service');
  });
});
