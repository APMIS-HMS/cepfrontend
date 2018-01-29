const assert = require('assert');
const app = require('../../src/app');

describe('\'resend-token\' service', () => {
  it('registered the service', () => {
    const service = app.service('resend-token');

    assert.ok(service, 'Registered the service');
  });
});
